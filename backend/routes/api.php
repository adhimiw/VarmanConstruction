<?php

use App\Http\Controllers\Api\AdminApiController;
use App\Http\Controllers\Api\PublicApiController;
use Illuminate\Support\Facades\Route;

$prefix = request()->is('api/*') || request()->is('api') ? 'api' : '';

Route::prefix($prefix)->middleware('api.headers')->group(function () {
    Route::options('{any}', fn () => response()->noContent())->where('any', '.*');

    Route::get('/', [PublicApiController::class, 'root']);
    Route::get('/health', [PublicApiController::class, 'health']);
    Route::get('/products', [PublicApiController::class, 'products']);
    Route::get('/products/{id}', [PublicApiController::class, 'product']);
    Route::get('/faqs', [PublicApiController::class, 'faqs']);
    Route::post('/contact', [PublicApiController::class, 'contact']);
    Route::post('/quote', [PublicApiController::class, 'quote']);
    Route::post('/analytics/track', [PublicApiController::class, 'analyticsTrack']);
    Route::post('/security/alert', [PublicApiController::class, 'securityAlert']);
    Route::get('/site-content', [PublicApiController::class, 'siteContent']);

    Route::prefix('admin')->group(function () {
        Route::post('/login', [AdminApiController::class, 'login']);

        Route::middleware('admin.token')->group(function () {
            Route::get('/verify', [AdminApiController::class, 'verify']);
            Route::post('/logout', [AdminApiController::class, 'logout']);
            Route::post('/change-password', [AdminApiController::class, 'changePassword']);
            Route::post('/upload', [AdminApiController::class, 'upload']);
            Route::delete('/upload/{filename}', [AdminApiController::class, 'deleteUpload']);
            Route::get('/images', [AdminApiController::class, 'images']);
            Route::get('/products', [AdminApiController::class, 'products']);
            Route::post('/products', [AdminApiController::class, 'storeProduct']);
            Route::put('/products/{id}', [AdminApiController::class, 'updateProduct']);
            Route::delete('/products/{id}', [AdminApiController::class, 'deleteProduct']);
            Route::get('/faqs', [AdminApiController::class, 'faqs']);
            Route::post('/faqs', [AdminApiController::class, 'storeFaq']);
            Route::put('/faqs/{id}', [AdminApiController::class, 'updateFaq']);
            Route::delete('/faqs/{id}', [AdminApiController::class, 'deleteFaq']);
            Route::get('/contacts', [AdminApiController::class, 'contacts']);
            Route::put('/contacts/{id}', [AdminApiController::class, 'updateContact']);
            Route::delete('/contacts/{id}', [AdminApiController::class, 'deleteContact']);
            Route::get('/quotes', [AdminApiController::class, 'quotes']);
            Route::put('/quotes/{id}', [AdminApiController::class, 'updateQuote']);
            Route::delete('/quotes/{id}', [AdminApiController::class, 'deleteQuote']);
            Route::get('/stats', [AdminApiController::class, 'stats']);

            // Admin Users
            Route::get('/users', [AdminApiController::class, 'adminUsers']);
            Route::post('/users', [AdminApiController::class, 'storeAdminUser']);
            Route::put('/users/{id}', [AdminApiController::class, 'updateAdminUser']);
            Route::delete('/users/{id}', [AdminApiController::class, 'deleteAdminUser']);

            // CMS / Leads / Visitors / Logs / Site Editor / Settings
            Route::prefix('cms')->group(function () {
                Route::get('/dashboard', [AdminApiController::class, 'cmsDashboard']);
                Route::get('/leads', [AdminApiController::class, 'leads']);
                Route::post('/leads', [AdminApiController::class, 'storeLead']);
                Route::put('/leads/{id}', [AdminApiController::class, 'updateLead']);
                Route::delete('/leads/{id}', [AdminApiController::class, 'deleteLead']);

                Route::get('/visitors', [AdminApiController::class, 'visitors']);
                Route::get('/visitors/{id}', [AdminApiController::class, 'visitorDetail']);

                Route::get('/activity-logs', [AdminApiController::class, 'activityLogs']);
                Route::get('/security-logs', [AdminApiController::class, 'securityLogs']);

                Route::get('/components', [AdminApiController::class, 'cmsComponents']);
                Route::post('/components', [AdminApiController::class, 'updateCmsComponent']);

                Route::get('/settings', [AdminApiController::class, 'cmsSettings']);
                Route::put('/settings', [AdminApiController::class, 'updateCmsSettings']);
            });
        });
    });

    Route::fallback(fn () => response()->json(['error' => 'Not found'], 404));
});
