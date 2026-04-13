<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add name and email to admin_users
        Schema::table('admin_users', function (Blueprint $table) {
            $table->string('name', 100)->nullable()->after('username');
            $table->string('email', 200)->nullable()->after('name');
        });

        // CRM Leads
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 200)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('company', 200)->nullable();
            $table->string('source', 100)->nullable();
            $table->string('status', 50)->default('new');
            $table->text('notes')->nullable();
            $table->decimal('value', 12, 2)->nullable();
            $table->timestamps();
        });

        // Visitor sessions
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 100)->unique();
            $table->string('ip_address', 100)->nullable();
            $table->string('country', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('device_type', 50)->nullable();
            $table->string('browser', 100)->nullable();
            $table->string('os', 100)->nullable();
            $table->unsignedInteger('pages_viewed')->default(0);
            $table->string('referrer', 500)->nullable();
            $table->timestamp('first_visit_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->index('ip_address');
            $table->index('last_activity_at');
        });

        // Individual page views per visitor
        Schema::create('visitor_page_views', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('visitor_id');
            $table->string('path', 500);
            $table->string('title', 300)->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->foreign('visitor_id')->references('id')->on('visitors')->onDelete('cascade');
        });

        // Admin activity log
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('action', 100);
            $table->string('admin_username', 100)->nullable();
            $table->string('entity_type', 100)->nullable();
            $table->string('entity_id', 100)->nullable();
            $table->text('description')->nullable();
            $table->string('ip_address', 100)->nullable();
            $table->timestamps();
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('visitor_page_views');
        Schema::dropIfExists('visitors');
        Schema::dropIfExists('leads');

        Schema::table('admin_users', function (Blueprint $table) {
            $table->dropColumn(['name', 'email']);
        });
    }
};
