<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

include __DIR__.'/auth.php'; 
include __DIR__.'/OAuth.php';   

# Public routes
Route::get('/v1/categories', [\App\Http\Controllers\CategoryController::class, 'index']);
Route::get('/v1/products', [\App\Http\Controllers\ProductController::class, 'index']);
Route::get('/v1/product/{id}', [\App\Http\Controllers\ProductController::class, 'getProductById']);

Route::middleware('auth:sanctum')->get('/v1/card/products', [\App\Http\Controllers\CardController::class, 'getProducts']);
#Route::resource('/v1/card',\App\Http\Controllers\CardController::class);
Route::middleware('auth:sanctum')->post('/v1/card/add/product/{id}', [\App\Http\Controllers\CardController::class, 'addProductToCard']);
Route::middleware('auth:sanctum')->delete('/v1/card/remove/product/{id}', [\App\Http\Controllers\CardController::class, 'removeProductFromCard']);
Route::middleware('auth:sanctum')->post('/v1/card/update/product/quantity/{id}/{quantity}', [\App\Http\Controllers\CardController::class, 'updateProductQuantity']);
Route::middleware('auth:sanctum')->resource('/v1/orders', \App\Http\Controllers\OrderController::class);
Route::get('/v1/create/guest/user', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'createGustUser']);