<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Mail;

try {
    Mail::raw('Plain text test', function ($message) {
        $message->to('adhithanraja6@gmail.com')->subject('Testing Mail HTML Exception Reveal');
    });
    echo "SUCCESS\n";
} catch (\Throwable $e) {
    echo "EXCEPTION_MSG=" . $e->getMessage() . "\n";
}
