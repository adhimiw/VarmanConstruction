<?php

namespace App\Http\Middleware;

use App\Support\GeoIpService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class TrackVisitor
{
    public function __construct(private readonly GeoIpService $geoIp)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        try {
            $this->trackVisitor($request);
        } catch (\Throwable $e) {
            // Don't break the request if tracking fails
        }

        return $response;
    }

    private function trackVisitor(Request $request): void
    {
        $ip = $this->getClientIp($request);
        $userAgent = $request->userAgent() ?? '';

        if ($this->isBot($userAgent)) {
            return;
        }

        $sessionId = $request->cookie('vsid') ?? Str::uuid()->toString();
        $now = now();

        $existing = DB::table('visitor_sessions')
            ->where('session_id', $sessionId)
            ->first();

        if ($existing) {
            $updateData = [
                'page_views' => $existing->page_views + 1,
                'last_activity_at' => $now,
                'duration_seconds' => $now->diffInSeconds($existing->first_visit_at),
            ];

            // Backfill geo data if missing on the existing session
            if (empty($existing->country)) {
                $geo = $this->geoIp->lookup($ip);
                if ($geo['country'] !== null) {
                    $updateData['country'] = $geo['country'];
                    $updateData['country_code'] = $geo['country_code'];
                    $updateData['city'] = $geo['city'];
                    $updateData['region'] = $geo['region'];
                    $updateData['timezone'] = $geo['timezone'];
                    $updateData['org'] = $geo['org'];
                    $updateData['isp'] = $geo['isp'];
                    $updateData['latitude'] = $geo['latitude'];
                    $updateData['longitude'] = $geo['longitude'];
                }
            }

            DB::table('visitor_sessions')
                ->where('id', $existing->id)
                ->update($updateData);
            $visitorId = $existing->id;
        } else {
            $deviceInfo = $this->parseDevice($userAgent);
            $geo = $this->geoIp->lookup($ip);

            $visitorId = DB::table('visitor_sessions')->insertGetId([
                'session_id' => $sessionId,
                'ip_address' => $ip,
                'country' => $geo['country'],
                'country_code' => $geo['country_code'],
                'city' => $geo['city'],
                'region' => $geo['region'],
                'timezone' => $geo['timezone'],
                'org' => $geo['org'],
                'isp' => $geo['isp'],
                'latitude' => $geo['latitude'],
                'longitude' => $geo['longitude'],
                'user_agent' => Str::limit($userAgent, 500),
                'device_type' => $deviceInfo['type'],
                'browser' => $deviceInfo['browser'],
                'browser_version' => $deviceInfo['browser_version'],
                'os' => $deviceInfo['os'],
                'os_version' => $deviceInfo['os_version'],
                'referrer' => Str::limit($request->header('Referer', ''), 500) ?: null,
                'landing_page' => Str::limit($request->path(), 500),
                'first_visit_at' => $now,
                'last_activity_at' => $now,
                'is_bot' => false,
            ]);
        }

        // Track page view
        DB::table('page_views')->insert([
            'visitor_session_id' => $visitorId,
            'path' => Str::limit($request->path(), 500),
            'ip_address' => $ip,
            'referrer' => Str::limit($request->header('Referer', ''), 500) ?: null,
            'viewed_at' => $now,
        ]);
    }

    private function getClientIp(Request $request): string
    {
        $forwarded = $request->header('X-Forwarded-For');
        if (is_string($forwarded) && $forwarded !== '') {
            return trim(explode(',', $forwarded)[0]);
        }
        return $request->ip() ?: '0.0.0.0';
    }

    private function isBot(string $userAgent): bool
    {
        $bots = ['bot', 'crawler', 'spider', 'curl', 'wget', 'python-requests', 'Go-http', 'Java/', 'node-fetch'];
        $ua = strtolower($userAgent);
        foreach ($bots as $bot) {
            if (str_contains($ua, strtolower($bot))) {
                return true;
            }
        }
        return false;
    }

    private function parseDevice(string $userAgent): array
    {
        $ua = strtolower($userAgent);

        // Device type
        $type = 'desktop';
        if (preg_match('/mobile|android.*mobile|iphone|ipod/', $ua)) {
            $type = 'mobile';
        } elseif (preg_match('/tablet|ipad|playbook|silk/', $ua)) {
            $type = 'tablet';
        }

        // Browser + version
        $browser = 'Unknown';
        $browserVersion = null;
        if (preg_match('/edg\/(\d+[\.\d]*)/', $ua, $m)) {
            $browser = 'Edge';
            $browserVersion = $m[1];
        } elseif (preg_match('/chrome\/(\d+[\.\d]*)/', $ua, $m) && !str_contains($ua, 'edg')) {
            $browser = 'Chrome';
            $browserVersion = $m[1];
        } elseif (preg_match('/firefox\/(\d+[\.\d]*)/', $ua, $m)) {
            $browser = 'Firefox';
            $browserVersion = $m[1];
        } elseif (preg_match('/version\/(\d+[\.\d]*).*safari/', $ua, $m)) {
            $browser = 'Safari';
            $browserVersion = $m[1];
        } elseif (preg_match('/opr\/(\d+[\.\d]*)/', $ua, $m) || preg_match('/opera\/(\d+[\.\d]*)/', $ua, $m)) {
            $browser = 'Opera';
            $browserVersion = $m[1];
        }

        // OS + version
        $os = 'Unknown';
        $osVersion = null;
        if (preg_match('/windows nt (\d+[\.\d]*)/', $ua, $m)) {
            $os = 'Windows';
            $ntMap = ['10.0' => '10/11', '6.3' => '8.1', '6.2' => '8', '6.1' => '7'];
            $osVersion = $ntMap[$m[1]] ?? $m[1];
        } elseif (preg_match('/mac os x (\d+[_\.\d]*)/', $ua, $m)) {
            $os = 'macOS';
            $osVersion = str_replace('_', '.', $m[1]);
        } elseif (preg_match('/android (\d+[\.\d]*)/', $ua, $m)) {
            $os = 'Android';
            $osVersion = $m[1];
        } elseif (preg_match('/(?:iphone|ipad) os (\d+[_\.\d]*)/', $ua, $m)) {
            $os = 'iOS';
            $osVersion = str_replace('_', '.', $m[1]);
        } elseif (str_contains($ua, 'linux') && !str_contains($ua, 'android')) {
            $os = 'Linux';
        }

        return [
            'type' => $type,
            'browser' => $browser,
            'browser_version' => $browserVersion,
            'os' => $os,
            'os_version' => $osVersion,
        ];
    }
}
