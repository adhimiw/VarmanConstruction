<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

class GeoIpService
{
    private const CACHE_TTL = 86400; // 24 hours
    private const REQUEST_TIMEOUT = 3;
    private const PROVIDER_URL = 'https://api.ipgeolocation.io/v2/ipgeo';

    /**
     * Resolve geolocation data for an IP address.
     *
     * @return array{country: ?string, country_code: ?string, region: ?string, city: ?string, latitude: ?float, longitude: ?float, timezone: ?string, org: ?string, isp: ?string}
     */
    public function lookup(string $ip): array
    {
        $empty = $this->emptyResult();

        if ($this->isPrivateIp($ip)) {
            return $empty;
        }

        $cacheKey = 'geoip:' . md5($ip);

        $cached = Cache::get($cacheKey);
        if (is_array($cached)) {
            return $cached;
        }

        try {
            $result = $this->fetchFromProvider($ip);

            if ($result !== null) {
                Cache::put($cacheKey, $result, self::CACHE_TTL);
                return $result;
            }
        } catch (Throwable $e) {
            Log::warning('GeoIpService lookup failed', [
                'ip' => $ip,
                'error' => $e->getMessage(),
            ]);
        }

        return $empty;
    }

    /**
     * Check if an IP is private/reserved (localhost, LAN, etc.)
     */
    public function isPrivateIp(string $ip): bool
    {
        if (in_array($ip, ['127.0.0.1', '::1', '0.0.0.0', 'unknown', ''], true)) {
            return true;
        }

        return filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) === false;
    }

    /**
     * Call ipgeolocation.io and normalize the response.
     */
    private function fetchFromProvider(string $ip): ?array
    {
        $apiKey = config('varman.geoip_api_key', '');

        // If ipgeolocation.io API key is configured, use it (primary)
        if ($apiKey !== '') {
            return $this->fetchFromIpGeolocation($ip, $apiKey);
        }

        // Fallback: ip-api.com (free, no key, limited to 45 req/min)
        return $this->fetchFromIpApi($ip);
    }

    /**
     * Primary provider: ipgeolocation.io (requires API key)
     */
    private function fetchFromIpGeolocation(string $ip, string $apiKey): ?array
    {
        $url = self::PROVIDER_URL . '?' . http_build_query([
            'apiKey' => $apiKey,
            'ip' => $ip,
            'fields' => 'country_name,country_code2,state_prov,city,latitude,longitude,time_zone,organization,isp',
        ]);

        $result = $this->httpGet($url);
        if ($result === null) {
            $result = $this->httpGet($url); // One retry
        }
        if ($result === null) {
            return null;
        }

        $data = json_decode($result, true);
        if (!is_array($data) || isset($data['message'])) {
            Log::warning('GeoIpService: ipgeolocation.io returned error', [
                'ip' => $ip,
                'response' => $result,
            ]);
            return null;
        }

        return $this->normalize($data);
    }

    /**
     * Fallback provider: ip-api.com (free, no key required)
     */
    private function fetchFromIpApi(string $ip): ?array
    {
        $url = 'http://ip-api.com/json/' . urlencode($ip) . '?fields=status,country,countryCode,regionName,city,lat,lon,timezone,org,isp';

        $result = $this->httpGet($url);
        if ($result === null) {
            $result = $this->httpGet($url); // One retry
        }
        if ($result === null) {
            return null;
        }

        $data = json_decode($result, true);
        if (!is_array($data) || ($data['status'] ?? '') !== 'success') {
            Log::warning('GeoIpService: ip-api.com returned error', [
                'ip' => $ip,
                'response' => $result,
            ]);
            return null;
        }

        return [
            'country' => $data['country'] ?? null,
            'country_code' => $data['countryCode'] ?? null,
            'region' => $data['regionName'] ?? null,
            'city' => $data['city'] ?? null,
            'latitude' => isset($data['lat']) ? (float) $data['lat'] : null,
            'longitude' => isset($data['lon']) ? (float) $data['lon'] : null,
            'timezone' => $data['timezone'] ?? null,
            'org' => $data['org'] ?? null,
            'isp' => $data['isp'] ?? null,
        ];
    }

    /**
     * Normalize provider response to internal field names.
     */
    private function normalize(array $data): array
    {
        $tz = $data['time_zone'] ?? [];

        return [
            'country' => $data['country_name'] ?? null,
            'country_code' => $data['country_code2'] ?? null,
            'region' => $data['state_prov'] ?? null,
            'city' => $data['city'] ?? null,
            'latitude' => isset($data['latitude']) ? (float) $data['latitude'] : null,
            'longitude' => isset($data['longitude']) ? (float) $data['longitude'] : null,
            'timezone' => is_array($tz) ? ($tz['name'] ?? null) : ($tz ?: null),
            'org' => $data['organization'] ?? null,
            'isp' => $data['isp'] ?? null,
        ];
    }

    /**
     * Simple HTTP GET with cURL and timeout.
     */
    private function httpGet(string $url): ?string
    {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => self::REQUEST_TIMEOUT,
            CURLOPT_CONNECTTIMEOUT => self::REQUEST_TIMEOUT,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 2,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_USERAGENT => 'VarmanConstructions/1.0',
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($response === false || $httpCode !== 200) {
            Log::debug('GeoIpService HTTP request failed', [
                'url' => preg_replace('/apiKey=[^&]+/', 'apiKey=***', $url),
                'http_code' => $httpCode,
                'error' => $error,
            ]);
            return null;
        }

        return $response;
    }

    /**
     * Return empty/null geo result structure.
     */
    public function emptyResult(): array
    {
        return [
            'country' => null,
            'country_code' => null,
            'region' => null,
            'city' => null,
            'latitude' => null,
            'longitude' => null,
            'timezone' => null,
            'org' => null,
            'isp' => null,
        ];
    }
}
