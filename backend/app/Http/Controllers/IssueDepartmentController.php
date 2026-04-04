<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IssueDepartmentController extends Controller {
    //

    public function index() {
        $data = DB::connection( 'sqlsrv' )
        ->table( 'issueDepartmentMaster' )
        ->select( 'Departmentid', 'DepartmentName' ) //
        ->paginate( 10 );
        return response()->json( [
            'status' => true,
            'data' => $data
        ] );
    }

    public function store( Request $request ) {

        $request->validate( [
            'DepartmentName' => 'required|string|max:255|unique:issueDepartmentMaster,DepartmentName'
        ] );
        DB::connection( 'sqlsrv' )
        ->table( 'issueDepartmentMaster' )
        ->insert( [
            'DepartmentName' => $request->DepartmentName,
            'Status' => 1,
            'CreatedDate' => now()
        ] );

        return response()->json( [
            'status' => true,
            'message' => 'Department created',
            // 'id' => $id
        ] );
    }

    public function show( $id ) {
        $data = DB::connection( 'sqlsrv' )
        ->table( 'issueDepartmentMaster' )
        ->select( 'Departmentid', 'DepartmentName', 'Status' )
        ->where( 'Departmentid', $id )
        ->first();

        return response()->json( [
            'status' => true,
            'data' => $data
        ] );
    }

    public function update( Request $request, $id ) {
        $request->validate( [
            'DepartmentName' => "required|string|max:255|unique:issueDepartmentMaster,DepartmentName,$id,Departmentid"
        ] );

        DB::connection( 'sqlsrv' )
        ->table( 'issueDepartmentMaster' )
        ->where( 'Departmentid', $id )
        ->update( [
            'DepartmentName' => $request->DepartmentName
        ] );

        return response()->json( [
            'status' => true,
            'message' => 'Department updated'
        ] );
    }

    public function destroy( $id ) {
        DB::connection( 'sqlsrv' )
        ->table( 'issueDepartmentMaster' )
        ->where( 'Departmentid', $id )
        ->delete();

        return response()->json( [
            'status' => true,
            'message' => 'Department deleted'
        ] );
    }
}
