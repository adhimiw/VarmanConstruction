<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create
                            {username? : Admin username}
                            {--password= : Admin password (will prompt if not provided)}';

    protected $description = 'Create or update an admin user';

    public function handle(): int
    {
        $username = $this->argument('username')
            ?? $this->ask('Enter admin username', 'admin');

        $password = $this->option('password')
            ?? $this->secret('Enter admin password');

        if (strlen($password) < 8) {
            $this->error('Password must be at least 8 characters.');
            return 1;
        }

        $exists = DB::table('admin_users')->where('username', $username)->exists();

        DB::table('admin_users')->updateOrInsert(
            ['username' => $username],
            [
                'password_hash' => Hash::make($password),
                'role' => 'admin',
            ]
        );

        $this->info($exists
            ? "Admin user '{$username}' password updated."
            : "Admin user '{$username}' created."
        );

        return 0;
    }
}
