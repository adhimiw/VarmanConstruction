<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Throwable;

class VarmanApiSupport
{
    public function utcTimestamp(): string
    {
        return gmdate('c');
    }

    public function utcDate(): string
    {
        return gmdate('Y-m-d');
    }

    public function sanitizeInput(mixed $value, int $max = 5000): mixed
    {
        if (! is_string($value)) {
            return $value;
        }

        $value = trim($value);
        $value = preg_replace('/[<>]/', '', $value) ?? $value;

        if (strlen($value) > $max) {
            $value = substr($value, 0, $max);
        }

        return $value;
    }

    public function normalizeList(mixed $value): array
    {
        if (is_array($value)) {
            return array_values($value);
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);

            if (is_array($decoded)) {
                return array_values($decoded);
            }

            $lines = array_filter(array_map('trim', explode("\n", $value)));

            return array_values($lines);
        }

        return [];
    }

    public function normalizePhone(mixed $phone, string $defaultCountryCode = '91'): string
    {
        if (! is_string($phone)) {
            return '';
        }

        $digits = preg_replace('/\D+/', '', $phone) ?? '';

        if ($digits === '') {
            return '';
        }

        if (str_starts_with($digits, '00')) {
            $digits = substr($digits, 2);
        }

        if (str_starts_with($digits, '0') && strlen($digits) > 10) {
            $digits = ltrim($digits, '0');
        }

        if (strlen($digits) === 10 && $defaultCountryCode !== '') {
            $digits = $defaultCountryCode.$digits;
        }

        return $digits;
    }

    public function getClientIp(Request $request): string
    {
        $forwardedFor = $request->header('X-Forwarded-For');

        if (is_string($forwardedFor) && $forwardedFor !== '') {
            $parts = explode(',', $forwardedFor);

            return trim($parts[0]);
        }

        return $request->ip() ?: 'unknown';
    }

    public function issueToken(array $payload): string
    {
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        $segments = [
            $this->base64UrlEncode(json_encode($header, JSON_UNESCAPED_SLASHES) ?: '{}'),
            $this->base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES) ?: '{}'),
        ];

        $signingInput = implode('.', $segments);
        $signature = hash_hmac('sha256', $signingInput, (string) config('varman.jwt_secret'), true);
        $segments[] = $this->base64UrlEncode($signature);

        return implode('.', $segments);
    }

    public function decodeToken(string $token): ?array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        [$headerB64, $payloadB64, $signatureB64] = $parts;
        $signingInput = $headerB64.'.'.$payloadB64;
        $signature = $this->base64UrlDecode($signatureB64);
        $expected = hash_hmac('sha256', $signingInput, (string) config('varman.jwt_secret'), true);

        if (! hash_equals($expected, $signature)) {
            return null;
        }

        $payload = json_decode($this->base64UrlDecode($payloadB64), true);

        if (! is_array($payload)) {
            return null;
        }

        if (isset($payload['exp']) && time() > (int) $payload['exp']) {
            return null;
        }

        return $payload;
    }

    public function checkRateLimit(string $key, int $max, int $windowSeconds): bool
    {
        $cacheKey = 'rate_limit:'.$key;
        $now = time();
        $state = Cache::get($cacheKey);

        if (! is_array($state) || (($state['reset_at'] ?? 0) <= $now)) {
            Cache::put($cacheKey, ['count' => 1, 'reset_at' => $now + $windowSeconds], $windowSeconds);

            return true;
        }

        if ((int) ($state['count'] ?? 0) >= $max) {
            return false;
        }

        $state['count'] = (int) ($state['count'] ?? 0) + 1;
        $ttl = max(1, (int) $state['reset_at'] - $now);
        Cache::put($cacheKey, $state, $ttl);

        return true;
    }

    public function sendEmailNotification(string $subject, string $body, ?string $to = null, bool $isHtml = false): bool
    {
        $recipient = $to ?: (string) config('varman.admin_email');

        if ($recipient === '') {
            return false;
        }

        try {
            if ($isHtml) {
                Mail::html($body, function ($message) use ($recipient, $subject) {
                    $message->to($recipient)->subject($subject);
                });
            } else {
                Mail::raw($body, function ($message) use ($recipient, $subject) {
                    $message->to($recipient)->subject($subject);
                });
            }

            return true;
        } catch (Throwable) {
            return false;
        }
    }

    public function buildClientThankYouEmail(string $name, string $material, string $projectLocation, string $message, string $reference): string
    {
        $siteName = 'VARMAN CONSTRUCTIONS';
        $siteUrl = (string) config('app.url', 'https://varmanconstructions.in');
        $adminEmail = (string) config('varman.admin_email', 'info@varmanconstructions.in');
        $whatsapp = (string) config('varman.admin_whatsapp', '917708484811');
        $whatsappUrl = "https://wa.me/{$whatsapp}";

        return <<<HTML
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Thank You – {$siteName}</title>
        </head>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                  <!-- Header -->
                  <tr>
                    <td style="background:#f97316;padding:24px 32px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:1px;">{$siteName}</h1>
                      <p style="margin:4px 0 0;color:#fff7ed;font-size:13px;">#1 Building Materials Supplier in Tamil Nadu</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:32px;">
                      <h2 style="margin:0 0 8px;color:#1c1917;font-size:20px;">Thank you, {$name}! 🙏</h2>
                      <p style="margin:0 0 20px;color:#57534e;font-size:15px;line-height:1.6;">
                        We've received your inquiry and our team will get back to you within <strong>24 hours</strong>.
                      </p>

                      <!-- Summary box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border-left:4px solid #f97316;border-radius:4px;margin-bottom:24px;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:#9a3412;text-transform:uppercase;letter-spacing:0.5px;">Your Inquiry Summary</p>
                            <table cellpadding="4" cellspacing="0" width="100%" style="font-size:14px;color:#292524;">
                              <tr><td style="color:#78716c;width:120px;">Material:</td><td><strong>{$material}</strong></td></tr>
                              <tr><td style="color:#78716c;">Location:</td><td>{$projectLocation}</td></tr>
                              <tr><td style="color:#78716c;vertical-align:top;">Message:</td><td>{$message}</td></tr>
                              <tr><td style="color:#78716c;">Reference:</td><td style="font-family:monospace;font-size:12px;">{$reference}</td></tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 20px;color:#57534e;font-size:14px;line-height:1.6;">
                        In the meantime, feel free to reach us directly:
                      </p>

                      <!-- CTA buttons -->
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-right:12px;">
                            <a href="{$whatsappUrl}" style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:bold;">
                              WhatsApp Us
                            </a>
                          </td>
                          <td>
                            <a href="mailto:{$adminEmail}" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:bold;">
                              Email Us
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#1c1917;padding:20px 32px;text-align:center;">
                      <p style="margin:0;color:#a8a29e;font-size:12px;">
                        © 2026 {$siteName} · <a href="{$siteUrl}" style="color:#f97316;text-decoration:none;">{$siteUrl}</a>
                      </p>
                      <p style="margin:6px 0 0;color:#78716c;font-size:11px;">
                        You received this because you contacted us via our website.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        HTML;
    }

    public function productFromRow(array $row): array
    {
        return [
            'id' => $row['id'],
            'icon' => $row['icon'],
            'name' => $row['name'],
            'short_description' => $row['short_description'] ?? null,
            'description' => $row['description'],
            'specifications' => $this->decodeJsonArray($row['specifications'] ?? null),
            'uses' => $this->decodeJsonArray($row['uses'] ?? null),
            'advantages' => $this->decodeJsonArray($row['advantages'] ?? null),
            'unit' => $row['unit'],
            'image' => $row['image'],
            'brands' => $this->decodeJsonArray($row['brands'] ?? null),
            'sizes' => $this->decodeJsonNullableArray($row['sizes'] ?? null),
            'types' => $this->decodeJsonNullableArray($row['types'] ?? null),
            'grades' => $this->decodeJsonNullableArray($row['grades'] ?? null),
            'active' => (bool) ($row['active'] ?? false),
        ];
    }

    public function analytics(): array
    {
        $views = (int) DB::table('analytics_views')->sum('views');
        $clickRows = DB::table('analytics_clicks')->get(['element', 'count']);
        $historyRows = DB::table('analytics_views')
            ->orderByDesc('date')
            ->limit(7)
            ->get(['date', 'views']);

        $clicks = [];

        foreach ($clickRows as $row) {
            $clicks[$row->element] = (int) $row->count;
        }

        $history = [];

        foreach ($historyRows as $row) {
            $history[] = [
                'date' => $row->date,
                'views' => (int) $row->views,
            ];
        }

        return [
            'views' => $views,
            'clicks' => $clicks,
            'history' => $history,
        ];
    }

    public function logSecurityEvent(string $type, string $path, string $ip, string $userAgent, string $severity = 'HIGH'): void
    {
        DB::table('security_logs')->insert([
            'type'       => $type,
            'path'       => $path,
            'ip'         => $ip,
            'user_agent' => $userAgent,
            'timestamp'  => $this->utcTimestamp(),
            'severity'   => $severity,
        ]);
    }

    public function logActivity(string $action, string $adminUsername, ?string $entityType, ?string $entityId, ?string $description, ?string $ip = null): void
    {
        try {
            DB::table('activity_logs')->insert([
                'action'         => $action,
                'admin_username' => $adminUsername,
                'entity_type'    => $entityType,
                'entity_id'      => $entityId,
                'description'    => $description,
                'ip_address'     => $ip,
                'created_at'     => $this->utcTimestamp(),
                'updated_at'     => $this->utcTimestamp(),
            ]);
        } catch (\Throwable) {
            // Don't break the request if logging fails
        }
    }

    public function trackVisitor(Request $request, string $path, ?string $title = null): void
    {
        try {
            $ip        = $this->getClientIp($request);
            $ua        = (string) ($request->userAgent() ?? '');
            $sessionId = md5($ip.'|'.$ua.'|'.gmdate('Y-m-d'));

            // Parse simple device/browser from UA
            $device  = str_contains($ua, 'Mobile') ? 'mobile' : (str_contains($ua, 'Tablet') ? 'tablet' : 'desktop');
            $browser = 'Unknown';

            foreach (['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'] as $b) {
                if (str_contains($ua, $b)) {
                    $browser = $b;
                    break;
                }
            }

            $os = 'Unknown';

            foreach (['Windows', 'Mac', 'Linux', 'Android', 'iOS'] as $o) {
                if (str_contains($ua, $o)) {
                    $os = $o;
                    break;
                }
            }

            $referrer = $this->sanitizeInput((string) ($request->header('Referer') ?? ''), 500);
            $now      = $this->utcTimestamp();

            $visitor = DB::table('visitors')->where('session_id', $sessionId)->first();

            if ($visitor) {
                DB::table('visitors')->where('session_id', $sessionId)->update([
                    'pages_viewed'     => (int) $visitor->pages_viewed + 1,
                    'last_activity_at' => $now,
                ]);

                DB::table('visitor_page_views')->insert([
                    'visitor_id' => $visitor->id,
                    'path'       => $this->sanitizeInput($path, 500),
                    'title'      => $this->sanitizeInput($title ?? '', 300),
                    'viewed_at'  => $now,
                ]);
            } else {
                $visitorId = DB::table('visitors')->insertGetId([
                    'session_id'       => $sessionId,
                    'ip_address'       => $ip,
                    'device_type'      => $device,
                    'browser'          => $browser,
                    'os'               => $os,
                    'referrer'         => $referrer !== '' ? $referrer : null,
                    'pages_viewed'     => 1,
                    'first_visit_at'   => $now,
                    'last_activity_at' => $now,
                ]);

                DB::table('visitor_page_views')->insert([
                    'visitor_id' => $visitorId,
                    'path'       => $this->sanitizeInput($path, 500),
                    'title'      => $this->sanitizeInput($title ?? '', 300),
                    'viewed_at'  => $now,
                ]);
            }
        } catch (\Throwable) {
            // Don't break the request if tracking fails
        }
    }
    }

    public function payload(Request $request): array
    {
        $data = $request->json()->all();

        return is_array($data) && $data !== [] ? $data : $request->all();
    }

    public function decodeJsonArray(mixed $value): array
    {
        if (is_array($value)) {
            return array_values($value);
        }

        if (! is_string($value) || $value === '') {
            return [];
        }

        $decoded = json_decode($value, true);

        return is_array($decoded) ? array_values($decoded) : [];
    }

    public function decodeJsonNullableArray(mixed $value): ?array
    {
        $decoded = $this->decodeJsonArray($value);

        return $decoded === [] ? null : $decoded;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $value): string
    {
        $remainder = strlen($value) % 4;

        if ($remainder > 0) {
            $value .= str_repeat('=', 4 - $remainder);
        }

        return base64_decode(strtr($value, '-_', '+/')) ?: '';
    }
}
