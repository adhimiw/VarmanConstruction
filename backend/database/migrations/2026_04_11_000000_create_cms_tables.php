<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // IP tracking / visitor sessions
        Schema::create('visitor_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 100)->unique();
            $table->string('ip_address', 45);
            $table->string('country', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('region', 100)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->string('device_type', 20)->default('desktop'); // desktop, mobile, tablet
            $table->string('browser', 50)->nullable();
            $table->string('os', 50)->nullable();
            $table->string('referrer', 500)->nullable();
            $table->string('landing_page', 500)->nullable();
            $table->unsignedInteger('page_views')->default(1);
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->timestamp('first_visit_at');
            $table->timestamp('last_activity_at');
            $table->boolean('is_bot')->default(false);
        });

        // Page view tracking (detailed)
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visitor_session_id')->nullable()->constrained('visitor_sessions')->nullOnDelete();
            $table->string('path', 500);
            $table->string('title', 300)->nullable();
            $table->string('ip_address', 45);
            $table->string('referrer', 500)->nullable();
            $table->unsignedInteger('time_on_page')->default(0);
            $table->timestamp('viewed_at');
        });

        // Activity log for admin audit trail
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_user_id')->nullable();
            $table->string('action', 100); // login, logout, create, update, delete, view
            $table->string('entity_type', 50)->nullable(); // product, faq, contact, quote, setting
            $table->string('entity_id', 100)->nullable();
            $table->text('description')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('created_at');
        });

        // CMS Pages for content management
        Schema::create('cms_pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 200)->unique();
            $table->string('title', 300);
            $table->text('content')->nullable();
            $table->json('meta')->nullable(); // SEO meta: title, description, keywords
            $table->string('template', 100)->default('default');
            $table->string('status', 20)->default('published'); // draft, published, archived
            $table->unsignedInteger('sort_order')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        });

        // Site settings (key-value store)
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('group', 50)->default('general'); // general, seo, contact, social, appearance, component_*
            $table->string('key', 100);
            $table->text('value')->nullable();
            $table->string('type', 20)->default('text'); // text, textarea, boolean, number, json, image
            $table->string('label', 200)->nullable();
            $table->timestamps();
            $table->unique(['group', 'key']);
        });

        // Lead management (CRM-like)
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('email', 200)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('source', 50)->default('website'); // website, whatsapp, phone, referral
            $table->string('status', 30)->default('new'); // new, contacted, qualified, proposal, won, lost
            $table->string('priority', 20)->default('medium'); // low, medium, high, urgent
            $table->text('notes')->nullable();
            $table->string('assigned_to', 100)->nullable();
            $table->decimal('estimated_value', 12, 2)->nullable();
            $table->string('project_type', 100)->nullable();
            $table->string('location', 200)->nullable();
            $table->json('tags')->nullable();
            $table->timestamp('last_contacted_at')->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at')->nullable();
        });

        // Notifications / alerts
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type', 50); // info, warning, success, error
            $table->string('title', 200);
            $table->text('message')->nullable();
            $table->string('action_url', 500)->nullable();
            $table->boolean('is_read')->default(false);
            $table->unsignedBigInteger('admin_user_id')->nullable();
            $table->timestamp('created_at');
        });

        // Add remember_token and timestamps to admin_users for Sanctum
        Schema::table('admin_users', function (Blueprint $table) {
            $table->string('email', 200)->nullable()->after('username');
            $table->string('name', 150)->nullable()->after('username');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('admin_users', function (Blueprint $table) {
            $table->dropColumn(['email', 'name', 'remember_token', 'created_at', 'updated_at']);
        });
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('leads');
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('cms_pages');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('page_views');
        Schema::dropIfExists('visitor_sessions');
    }
};
