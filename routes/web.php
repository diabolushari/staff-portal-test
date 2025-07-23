<?php

use App\Http\Controllers\Parameter\ParameterController;
use App\Http\Controllers\Parameter\ParameterDomainController;
use App\Http\Controllers\SystemModule\SystemModuleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::resource('system-module', SystemModuleController::class);
Route::resource('parameter/domain', ParameterDomainController::class);
Route::resource('parameter', ParameterController::class);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
