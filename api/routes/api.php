<?php

use App\Http\Controllers\AttachmentsController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ShareController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use App\Models\User;
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

        Route::get('/users', function () {
            return response()->json([
                'status' => 200,
                'message' => 'List of Users',
                'users' => User::all(),
            ]);
        });

        Route::post('/note/{id}/attachments', [AttachmentsController::class, 'store']);
        Route::get('/tags', [TagController::class, 'index']);
        Route::get('/histories', [HistoryController::class, 'index']);
        Route::post('/share', [ShareController::class, 'store']);
        Route::post('/share/verify', [ShareController::class, 'verify']);
        Route::get('/share', [ShareController::class, 'index']);
        Route::get('/share/{id}', [ShareController::class, 'show']);
        Route::get('/my-shared-notes', [ShareController::class, 'mySharedNotes']);
        Route::post('/revoke-access', [ShareController::class, 'revokeAccess']);
        Route::apiResource('notes', NoteController::class);
    });
});
