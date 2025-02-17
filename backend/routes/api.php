<?php

use App\Http\Controllers\api\CategoryController;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\CartController;
use App\Http\Controllers\api\RoleController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\ValueController;
use App\Http\Controllers\api\SlideController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\ProductController;
use App\Models\Variant_option;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix('auth')->group(function () {
    Route::post('signup', [AuthController::class, 'signup']);
    Route::post('verifyOTP', [AuthController::class, 'verifyOTP']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::prefix('user')->group(function () {
    Route::get('list', [UserController::class, 'index']);
    Route::get('', [UserController::class, 'profile']);
    Route::post('', [UserController::class, 'store']);
    Route::get('{id}', [UserController::class, 'edit']);
    Route::post('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->prefix('cart')->group(function () {
    Route::get('', [CartController::class, 'index']);
    Route::post('', [CartController::class, 'store']);
    Route::put('/{id}', [CartController::class, 'update']);
    Route::delete('/{id}', [CartController::class, 'destroy']);
});

Route::prefix('category')->group(function () {
    Route::get('', [CategoryController::class, 'index']);
    Route::post('', [CategoryController::class, 'store']);
    Route::get('{id}', [CategoryController::class, 'edit']);
    Route::post('{id}', [CategoryController::class, 'update']);
    Route::delete('{id}', [CategoryController::class, 'destroy']);
});

Route::prefix('role')->group(function () {
    Route::get('', [RoleController::class, 'index']);
    Route::post('', [RoleController::class, 'store']);
    Route::get('/{id}', [RoleController::class, 'edit']);
    Route::post('/{id}', [RoleController::class, 'update']);
    Route::delete('/{id}', [RoleController::class, 'destroy']);
    Route::post('/{id}/restore', [RoleController::class, 'restore']);
});

Route::prefix('product')->group(function () {
    Route::get('', [ProductController::class, 'index']);
    Route::post('', [ProductController::class, 'store']);
    Route::get('/feat/{feat}', [ProductController::class, 'featProducts']);
    Route::get('/cat/{cat}', [ProductController::class, 'catProducts']);
    Route::get('/{slug}', [ProductController::class, 'show']);
    Route::post('/home/filter', [ProductController::class, 'filterProducts']);
});


Route::prefix('slider')->group(function () {
    Route::post('/', [SlideController::class, 'store']);
    Route::get('/', [SlideController::class, 'show']);
    Route::delete('/{id}', [SlideController::class, 'destroy']);
    Route::get('/{id}', [SlideController::class, 'edit']);
    Route::post('/{id}', [SlideController::class, 'update']);
});