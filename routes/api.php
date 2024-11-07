<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

# Routes Included
include __DIR__.'/auth.php'; 
include __DIR__.'/OAuth.php';   

# Public routes
Route::get('/v1/categories', [\App\Http\Controllers\CategoryController::class, 'index']);
Route::get('/v1/products', [\App\Http\Controllers\ProductController::class, 'index']);
Route::get('/v1/product/{id}', [\App\Http\Controllers\ProductController::class, 'getProductById']);
Route::resource('/v1/products', \App\Http\Controllers\ProductController::class)->only(['index' , 'show']);
Route::resource('/v1/categories', \App\Http\Controllers\CategoryController::class)->only(['index' , 'show']);
Route::get('/v1/create/guest/user', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'createGustUser']);
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['status' => 'CSRF cookie set']);
});

# Authenticated routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/v1/card/products', [\App\Http\Controllers\CardController::class, 'getProducts']);
    Route::post('/v1/card/add/product/{id}', [\App\Http\Controllers\CardController::class, 'addProductToCard']);
    Route::delete('/v1/card/remove/product/{id}', [\App\Http\Controllers\CardController::class, 'removeProductFromCard']);
    Route::post('/v1/card/update/product/quantity/{id}/{quantity}', [\App\Http\Controllers\CardController::class, 'updateProductQuantity']);
    Route::resource('/v1/orders', \App\Http\Controllers\OrderController::class);
});

# Admin routes
Route::group(['middleware' => ['auth:sanctum', 'abilities:admin']], function () {
    Route::get('/v1/dashboard/products', [\App\Http\Controllers\ProductController::class , 'getData']);
    Route::delete('/v1/remove/product/{id}', [\App\Http\Controllers\ProductController::class, 'removeProduct'] );
    Route::post('/v1/products/{id}/update-images', [App\Http\Controllers\ProductController::class, 'updateImages']);
    Route::delete('/v1/products/{produitId}/remove-image/{imageId}', [App\Http\Controllers\ProductController::class, 'removeImage']);
    Route::resource('/v1/products', \App\Http\Controllers\ProductController::class)->only(['store' , 'update' , 'destroy']);
    Route::resource('/v1/categories', \App\Http\Controllers\CategoryController::class)->only(['store' , 'update' , 'destroy']);
    Route::get('/v1/dashboard/categories', [\App\Http\Controllers\CategoryController::class , 'getData']);
});