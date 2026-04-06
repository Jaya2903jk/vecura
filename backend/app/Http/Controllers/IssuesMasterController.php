<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IssuesMasterController extends Controller {
    /**
    * GET ALL RECORDS
    */

    public function index() {
        $data = DB::connection( 'sqlsrv' )
        ->table( 'issueMaster' )
        // ->orderBy( 'id', 'desc' )
        ->get();

        return response()->json( [
            'status' => true,
            'data' => $data
        ] );
    }

    /**
    * CREATE NEW RECORD
    */

    public function store( Request $request ) {
        $request->validate( [
            'name' => 'required'
        ] );

        $id = DB::connection( 'sqlsrv' )
        ->table( 'issueMaster' )
        ->insertGetId( [
            'name' => $request->name,
            'status' => $request->status ?? 1,
            'created_at' => now(),
            'updated_at' => now()
        ] );

        return response()->json( [
            'status' => true,
            'message' => 'Created successfully',
            'id' => $id
        ] );
    }

    /**
    * GET SINGLE RECORD
    */

    public function show( $id ) {
        $data = DB::connection( 'sqlsrv' )
        ->table( 'issueMaster' )
        ->where( 'id', $id )
        ->first();

        if ( !$data ) {
            return response()->json( [
                'status' => false,
                'message' => 'Not Found'
            ], 404 );
        }

        return response()->json( [
            'status' => true,
            'data' => $data
        ] );
    }

    /**
    * UPDATE RECORD
    */

    public function update( Request $request, $id ) {
        $record = DB::connection( 'sqlsrv' )
        ->table( 'issueMaster' )
        ->where( 'id', $id )
        ->first();

        if ( !$record ) {
            return response()->json( [
                'status' => false,
                'message' => 'Not Found'
            ], 404 );
        }

        DB::connection( 'sqlsrv' )
        ->table( 'issueMaster' )
        ->where( 'id', $id )
        ->update( [
            'name' => $request->name ?? $record->name,
            'status' => $request->status ?? $record->status,
            'updated_at' => now()
        ] );

        return response()->json( [
            'status' => true,
            'message' => 'Updated successfully'
        ] );
    }

    /**
    * DELETE RECORD
    */

    public function destroy( $id ) {
        $record = DB::connection( 'sqlsrv' )
        ->table( 'issueMaster' )
        ->where( 'id', $id )
        ->first();

        if ( !$record ) {
            return response()->json( [
                'status' => false,
                'message' => 'Not Found'
            ], 404 );
        }

        DB::connection( 'sqlsrv' )
        ->table( 'issueMaster' )
        ->where( 'id', $id )
        ->delete();

        return response()->json( [
            'status' => true,
            'message' => 'Deleted successfully'
        ] );
    }
}
