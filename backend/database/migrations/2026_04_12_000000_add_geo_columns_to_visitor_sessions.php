<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('visitor_sessions', function (Blueprint $table) {
            $table->string('country_code', 10)->nullable()->after('country');
            $table->string('timezone', 100)->nullable()->after('region');
            $table->string('org', 200)->nullable()->after('timezone');
            $table->string('isp', 200)->nullable()->after('org');
            $table->decimal('latitude', 10, 6)->nullable()->after('isp');
            $table->decimal('longitude', 10, 6)->nullable()->after('latitude');
            $table->string('browser_version', 30)->nullable()->after('browser');
            $table->string('os_version', 30)->nullable()->after('os');
        });
    }

    public function down(): void
    {
        Schema::table('visitor_sessions', function (Blueprint $table) {
            $table->dropColumn([
                'country_code', 'timezone', 'org', 'isp',
                'latitude', 'longitude', 'browser_version', 'os_version',
            ]);
        });
    }
};
