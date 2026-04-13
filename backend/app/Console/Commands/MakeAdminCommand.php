<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use function Laravel\Prompts\text;
use function Laravel\Prompts\password;

class MakeAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a secure admin user interactively.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔑 Create New secure Administrator');

        $name = text(
            label: 'What is the admin Name?',
            placeholder: 'Super Admin',
            required: true
        );

        $username = text(
            label: 'What is the admin Username?',
            placeholder: 'admin',
            required: true,
            validate: fn (string $value) => DB::table('admin_users')->where('username', $value)->exists()
                ? 'The username has already been taken.'
                : null
        );

        $email = text(
            label: 'What is the admin Email?',
            placeholder: 'admin@varmanconstructions.in',
            required: true,
            validate: fn (string $value) => !filter_var($value, FILTER_VALIDATE_EMAIL)
                ? 'Please enter a valid email address.'
                : null
        );

        $pass = password(
            label: 'Set the secure login Password',
            required: true,
            validate: fn (string $value) => strlen($value) < 8
                ? 'The password must be at least 8 characters long for security purposes.'
                : null
        );

        DB::table('admin_users')->insert([
            'username' => $username,
            'password_hash' => Hash::make($pass),
            'role' => 'admin',
            'name' => $name,
            'email' => $email,
            'must_change_password' => 0, // No need to force change since they are setting it now
        ]);

        $this->info('');
        $this->info("✅ Super Admin user '{$username}' created securely!");
    }
}
