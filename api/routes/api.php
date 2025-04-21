<?php

use App\Http\Controllers\HistoryController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ShareController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::prefix('/v1')->group(function () {
    Route::prefix('/guest')->group(function () {
        Route::post('/login', [UserController::class, 'login']);
        Route::post('/register', [UserController::class, 'register']);
    });
    Route::prefix('/auth')->middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [UserController::class, 'logout']);
        Route::get('/user', function (Request $request) {
            return $request->user();
        })->middleware('auth:sanctum');

        Route::post('/note/{id}/attachments', [ShareController::class, 'store']);
        Route::get('/tags', [TagController::class, 'index']);
        Route::get('/histories', [HistoryController::class, 'index']);
        Route::post('/share', [ShareController::class, 'store']);
        Route::get('/share/{id}/show', [ShareController::class, 'show']);
        Route::apiResource('notes', NoteController::class);
    });
});