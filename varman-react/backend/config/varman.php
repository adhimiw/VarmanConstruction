<?php

$defaults = [
    'jwt_secret' => env('JWT_SECRET', 'varman-constructions-dev-secret-key-2024-do-not-use-in-prod'),
    'jwt_exp' => (int) env('JWT_EXP', 60 * 60 * 24),
    'admin_whatsapp' => env('ADMIN_WHATSAPP', '917708484811'),
    'default_country_code' => env('DEFAULT_COUNTRY_CODE', '91'),
    'admin_default_user' => env('ADMIN_DEFAULT_USER', 'admin'),
    'admin_default_pass' => env('ADMIN_DEFAULT_PASS', 'varman@2024'),
    'admin_email' => env('ADMIN_EMAIL', 'info@varmanconstructions.in'),
    'uploads_dir' => base_path('../assets/uploads'),
    'uploads_url' => './assets/uploads',
    'assets_dir' => base_path('../assets'),
    'smtp' => [
        'host' => env('MAIL_HOST', env('SMTP_HOST', '')),
        'port' => (int) env('MAIL_PORT', env('SMTP_PORT', 587)),
        'user' => env('MAIL_USERNAME', env('SMTP_USER', '')),
        'pass' => env('MAIL_PASSWORD', env('SMTP_PASS', '')),
        'from' => env('MAIL_FROM_ADDRESS', env('SMTP_FROM', '')),
        'secure' => env('MAIL_SCHEME', env('SMTP_SECURE', 'tls')),
    ],
];

$overridePath = base_path('../storage/config.php');

if (is_file($overridePath)) {
    $override = include $overridePath;

    if (is_array($override)) {
        $defaults = array_replace_recursive($defaults, $override);
    }
}

if (env('APP_ENV') === 'production') {
    if ($defaults['jwt_secret'] === 'varman-constructions-dev-secret-key-2024-do-not-use-in-prod') {
        throw new \Exception('JWT_SECRET must be set to a secure random value in production.');
    }
}

return $defaults;
