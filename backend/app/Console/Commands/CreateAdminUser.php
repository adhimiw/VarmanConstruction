<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'make:admin
        {--username= : Admin username}
        {--password= : Admin password}
        {--role=admin : Role (admin or super_admin)}';
    protected $description = 'Create an admin user';

    public function handle(): int
    {
        $username = $this->option('username') ?: $this->ask('Username');
        $password = $this->option('password') ?: $this->secret('Password');
        $role = $this->option('role');

        if (!$username || !$password) {
            $this->error('Username and password are required.');
            return self::FAILURE;
        }

        if (DB::table('admin_users')->where('username', $username)->exists()) {
            $this->error("Admin user '{$username}' already exists.");
            return self::FAILURE;
        }

        if (strlen($password) < 6) {
            $this->error('Password must be at least 6 characters.');
            return self::FAILURE;
        }

        if (!in_array($role, ['admin', 'super_admin'])) {
            $this->error("Invalid role. Use 'admin' or 'super_admin'.");
            return self::FAILURE;
        }

        DB::table('admin_users')->insert([
            'username' => $username,
            'password_hash' => Hash::make($password),
            'role' => $role,
        ]);

        $this->info("Admin user '{$username}' created successfully with role '{$role}'.");

        return self::SUCCESS;
    }
}
