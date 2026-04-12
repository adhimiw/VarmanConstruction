<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->text('password_hash');
            $table->string('role');
        });

        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('icon')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('specifications')->nullable();
            $table->text('uses')->nullable();
            $table->text('advantages')->nullable();
            $table->string('unit')->nullable();
            $table->string('image')->nullable();
            $table->text('brands')->nullable();
            $table->text('sizes')->nullable();
            $table->text('types')->nullable();
            $table->text('grades')->nullable();
            $table->boolean('active')->default(true);
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question', 300);
            $table->text('answer');
            $table->string('category', 50)->default('general');
            $table->boolean('active')->default(true);
        });

        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 200);
            $table->string('phone', 20);
            $table->string('material', 100)->default('Not specified');
            $table->text('message');
            $table->string('project_location', 200)->default('Not specified');
            $table->string('created_at');
            $table->boolean('read')->default(false);
        });

        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 200);
            $table->string('phone', 20);
            $table->text('materials');
            $table->string('quantity', 200);
            $table->text('project_details')->nullable();
            $table->string('timeline', 100)->default('Not specified');
            $table->string('created_at');
            $table->string('status', 100);
        });

        Schema::create('analytics_views', function (Blueprint $table) {
            $table->string('date')->primary();
            $table->unsignedInteger('views')->default(0);
        });

        Schema::create('analytics_clicks', function (Blueprint $table) {
            $table->string('element')->primary();
            $table->unsignedInteger('count')->default(0);
        });

        Schema::create('security_logs', function (Blueprint $table) {
            $table->id();
            $table->string('type', 100);
            $table->string('path', 200);
            $table->string('ip', 100);
            $table->string('user_agent', 300)->nullable();
            $table->string('timestamp');
            $table->string('severity', 20);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_logs');
        Schema::dropIfExists('analytics_clicks');
        Schema::dropIfExists('analytics_views');
        Schema::dropIfExists('quotes');
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('products');
        Schema::dropIfExists('admin_users');
    }
};
