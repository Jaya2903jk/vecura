<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\IssueDepartmentController;
use App\Http\Controllers\IssuesMasterController;
use App\Http\Controllers\MasterController;
use App\Http\Controllers\TicketController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;






Route::get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('check.token')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user-menu', [AuthController::class, 'getUserMenu']);
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::post('/tickets/{id}/approve', [TicketController::class, 'approve']);
    Route::post('/tickets/{id}/reject', [TicketController::class, 'reject']);
    Route::post('/tickets/{id}/accept', [TicketController::class, 'accept']);


    Route::get('/customers/search', [MasterController::class, 'searchCustomer']);
    Route::get('/search-service', [MasterController::class, 'searchService']);    // Route::post('/billing', [MasterController::class, 'store']);

    // Route::get('/departments', [DepartmentController::class, 'index']);
    // Route::post('/departments', [DepartmentController::class, 'store']);
    // Route::get('/departments/{id}', [DepartmentController::class, 'show']);
    // Route::put('/departments/{id}', [DepartmentController::class, 'update']);
    // Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
    Route::get('/departments', [MasterController::class, 'departments']);
    Route::get('/issue-levels/{departmentId}', [MasterController::class, 'levels']);
    Route::get('/issue-subjects/{levelId}', [MasterController::class, 'subjects']);

    Route::get('/issue-departments', [IssueDepartmentController::class, 'index']);     // list
    Route::post('/issue-departments', [IssueDepartmentController::class, 'store']);    // create
    Route::get('/issue-departments/{id}', [IssueDepartmentController::class, 'show']); // view single
    Route::put('/issue-departments/{id}', [IssueDepartmentController::class, 'update']);
    Route::delete('/issue-departments/{id}', [IssueDepartmentController::class, 'destroy']);

    Route::get('/issues-master', [IssuesMasterController::class, 'index']);
    Route::post('/issues-master', [IssuesMasterController::class, 'store']);
    Route::get('/issues-master/{id}', [IssuesMasterController::class, 'show']);
    Route::put('/issues-master/{id}', [IssuesMasterController::class, 'update']);
    Route::delete('/issues-master/{id}', [IssuesMasterController::class, 'destroy']);
});
