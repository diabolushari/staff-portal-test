<?php

use App\Http\Controllers\Api\ParameterDefinitionItemApiController;
use App\Http\Controllers\Api\ParameterDefinitionListApiController;
use App\Http\Controllers\Api\ParameterDomainListApiController;
use App\Http\Controllers\Api\SystemModuleApiController;
use App\Http\Controllers\Parameter\ParameterDefinitionController;
use App\Http\Controllers\Parameter\ParameterDomainController;
use App\Http\Controllers\Parameter\ParameterValueController;
use App\Http\Controllers\SystemModule\SystemModuleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('system-module', SystemModuleController::class);
    Route::resource('parameter-domain', ParameterDomainController::class);
    Route::resource('parameter-definition', ParameterDefinitionController::class);
    Route::resource('parameter-value', ParameterValueController::class);
});

# API List
Route::get('api/system-modules', SystemModuleApiController::class);
Route::get('api/parameter-domains', ParameterDomainListApiController::class);
Route::get('api/parameter-definitions', ParameterDefinitionListApiController::class);
Route::get('api/parameter-definitions/{id}', ParameterDefinitionItemApiController::class);




require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
