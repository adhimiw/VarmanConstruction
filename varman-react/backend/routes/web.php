<?php

use Illuminate\Support\Facades\Route;

Route::fallback(function () {
    return response()->json(['error' => 'Not found'], 404);
});
