<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Throwable;

class TestMail extends Command
{
    protected $signature = 'mail:test {email : The email address to send the test to}';

    protected $description = 'Send a test email to verify SMTP configuration';

    public function handle(): int
    {
        $recipient = $this->argument('email');

        $this->info("Sending test email to: {$recipient}");
        $this->line('');
        $this->line('MAIL CONFIG:');
        $this->line('  MAILER : ' . config('mail.default'));
        $this->line('  HOST   : ' . config('mail.mailers.smtp.host'));
        $this->line('  PORT   : ' . config('mail.mailers.smtp.port'));
        $this->line('  USER   : ' . config('mail.mailers.smtp.username'));
        $this->line('  FROM   : ' . config('mail.from.address'));
        $this->line('  SCHEME : ' . config('mail.mailers.smtp.encryption'));
        $this->line('');

        try {
            Mail::raw(
                "This is a test email from VARMAN CONSTRUCTIONS.\n\nIf you received this, your mail configuration is working correctly.\n\nSent at: " . now()->toDateTimeString(),
                function ($message) use ($recipient) {
                    $message
                        ->to($recipient)
                        ->subject('[TEST] Varman Constructions Mail Configuration');
                }
            );

            $this->info('✅ Test email sent successfully!');
            $this->line("Check inbox at: {$recipient}");
            return 0;
        } catch (Throwable $e) {
            $this->error('❌ Failed to send email!');
            $this->line('Error: ' . $e->getMessage());
            $this->line('');
            $this->line('Common fixes:');
            $this->line('  - Verify MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD in .env');
            $this->line('  - For Hostinger: MAIL_HOST=smtp.hostinger.com MAIL_PORT=465 MAIL_SCHEME=smtps');
            $this->line('  - Make sure you ran: php artisan config:cache after editing .env');
            return 1;
        }
    }
}
