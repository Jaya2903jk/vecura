<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IssuesMasterController extends Controller {
    /**
    * GET ALL RECORDS
    */

    // public function index()
    // {
    //     $data = DB::connection( 'sqlsrv' )
    //         ->table( 'issueMasterTest' )
    //         // ->orderBy( 'id', 'desc' )
    //         ->get();

    //     return response()->json( [
    //         'status' => true,
    //         'data' => $data
    // ] );
    // }

    public function index() {
        $data = DB::connection( 'sqlsrv' )
        ->table( 'IssueMasterTest as im' )
        ->leftJoin( 'issueDepartmentMaster as d', 'im.DepartmentId', '=', 'd.Departmentid' )
        ->leftJoin( 'issue_categories as c', 'im.CategoryId', '=', 'c.category_id' )
        ->leftJoin( 'User_Group_Master as r1', 'im.Level1Role', '=', 'r1.UserGroupID' )
        ->leftJoin( 'User_Group_Master as r2', 'im.Level2Role', '=', 'r2.UserGroupID' )
        ->leftJoin( 'User_Group_Master as r3', 'im.Level3Role', '=', 'r3.UserGroupID' )
        ->leftJoin( 'User_Group_Master as r4', 'im.Level4Role', '=', 'r4.UserGroupID' )
        ->leftJoin( 'User_Group_Master as r5', 'im.Level5Role', '=', 'r5.UserGroupID' )
        ->select(
            'im.*',
            'd.DepartmentName',
            'c.category_name',
            'r1.UserGroupName as Level1Name',
            'r2.UserGroupName as Level2Name',
            'r3.UserGroupName as Level3Name',
            'r4.UserGroupName as Level4Name',
            'r5.UserGroupName as Level5Name'
        )
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
        // dd( $request->all() );
        $request->validate( [
            'DepartmentId' => 'required',
            'CategoryId'   => 'required',
            'IssueName'    => 'required',
        ] );
        $id = DB::connection( 'sqlsrv' )
        ->table( 'IssueMasterTest' )
        ->insertGetId( [
            'DepartmentId' => $request->DepartmentId,
            'CategoryId'   => $request->CategoryId,
            'IssueName'    => $request->IssueName,
            'Status'       => $request->Status ?? 1,
            'Level1Role' => $request->Level1Role,
            'Level2Role' => $request->Level2Role,
            'Level3Role' => $request->Level3Role,
            'Level4Role' => $request->Level4Role,
            'Level5Role' => $request->Level5Role,

            // 'CreatedDate' => now(),
            // 'ModifiedDate' => now(),
        ] );

        return response()->json( [
            'status' => true,
            'message' => 'Created Successfully',
            'id' => $id
        ] );
    }
    /**
    * GET SINGLE RECORD
    */

    public function show( $id ) {
        $data = DB::connection( 'sqlsrv' )
        ->table( 'issueMasterTest' )
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
        ->table( 'issueMasterTest' )
        ->where( 'id', $id )
        ->first();

        if ( !$record ) {
            return response()->json( [
                'status' => false,
                'message' => 'Not Found'
            ], 404 );
        }

        DB::connection( 'sqlsrv' )
        ->table( 'issueMasterTest' )
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
        ->table( 'issueMasterTest' )
        ->where( 'IssueId', $id )
        ->first();

        if ( !$record ) {
            return response()->json( [
                'status' => false,
                'message' => 'Not Found'
            ], 404 );
        }

        DB::connection( 'sqlsrv' )
        ->table( 'issueMasterTest' )
        ->where( 'IssueId', $id )
        ->delete();

        return response()->json( [
            'status' => true,
            'message' => 'Deleted successfully'
        ] );
    }
}
