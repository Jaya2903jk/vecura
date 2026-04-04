<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/test-db', function () {
    $data = DB::select("SELECT TOP 10 * FROM User_Master");
    return response()->json($data);
});
