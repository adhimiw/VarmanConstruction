<?php

namespace App\Providers;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $smtp = config('varman.smtp', []);
        $fromAddress = $smtp['from'] ?: config('varman.admin_email');

        Config::set('mail.default', !empty($smtp['host']) && !empty($smtp['user']) ? 'smtp' : 'log');
        Config::set('mail.mailers.smtp', [
            'transport' => 'smtp',
            'host' => $smtp['host'] ?: '127.0.0.1',
            'port' => (int) ($smtp['port'] ?? 587),
            'encryption' => $smtp['secure'] ?: null,
            'username' => $smtp['user'] ?: null,
            'password' => $smtp['pass'] ?: null,
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN'),
        ]);
        Config::set('mail.from.address', $fromAddress ?: 'info@varmanconstructions.in');
        Config::set('mail.from.name', config('app.name'));
    }
}
