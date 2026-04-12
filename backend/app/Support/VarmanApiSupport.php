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

    public function sendEmailNotification(string $subject, string $body, ?string $to = null): bool
    {
        $recipient = $to ?: (string) config('varman.admin_email');

        if ($recipient === '') {
            return false;
        }

        try {
            Mail::raw($body, function ($message) use ($recipient, $subject) {
                $message->to($recipient)->subject($subject);
            });

            return true;
        } catch (Throwable) {
            return false;
        }
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
            'type' => $type,
            'path' => $path,
            'ip' => $ip,
            'user_agent' => $userAgent,
            'timestamp' => $this->utcTimestamp(),
            'severity' => $severity,
        ]);
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
