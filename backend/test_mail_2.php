<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Mail;

try {
    Mail::html('<html><body><p>Hello! This is a minimal HTML test.</p></body></html>', function ($message) {
        $message->to('adhithanraja6@gmail.com')->subject('Minimal HTML Test from Laravel');
    });
    echo "SUCCESS\n";
} catch (\Throwable $e) {
    echo "EXCEPTION_MSG=" . $e->getMessage() . "\n";
}
