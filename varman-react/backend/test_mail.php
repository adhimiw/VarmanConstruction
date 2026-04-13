<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Mail;

try {
    Mail::raw('This is a test to explicitly verify SMTP routing to gmail.', function ($message) {
        $message->to('adhithanraja6@gmail.com')->subject('Manual Test Email');
    });
    echo "Sent to adhithanraja6 successfully.\n";

    Mail::raw('This is a test to explicitly verify SMTP routing to gmail.', function ($message) {
        $message->to('adhithanmiw@gmail.com')->subject('Manual Test Email');
    });
    echo "Sent to adhithanmiw successfully.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
