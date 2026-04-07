<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IssuesCategoryController extends Controller {
    public function index( Request $request ) {
        $query = DB::table( 'issue_categories' );
        $query = DB::table( 'issue_categories as ic' )
        ->leftJoin( 'issueDepartmentMaster as d', 'ic.department_id', '=', 'd.Departmentid' )
        ->select(
            'ic.category_id',
            'ic.category_name',
            'ic.description',
            'ic.status',
            'ic.created_at',
            'ic.updated_at',
            'ic.department_id',
            'd.DepartmentName as DepartmentName'
        );
        if ( $request->search ) {
            $query->where( 'category_name', 'like', '%' . $request->search . '%' );
        }
        if ( $request->status ) {
            if ( $request->status == 1 ) {
                $query->where( 'status', 'Active' );
            } elseif ( $request->status == 2 ) {
                $query->where( 'status', 'Inactive' );
            }
        }
        $data = $query
        ->orderBy( 'category_id', 'desc' )
        ->paginate( 10 );

        return response()->json( [
            'status' => true,
            'data' => $data
        ] );
    }

    public function store( Request $request ) {
        try {
            $request->validate( [
                'DepartmentId' => 'required|exists:issueDepartmentMaster,Departmentid',
                'category_name' => 'required|string|max:255|unique:issue_categories,category_name|regex:/^\S.*$/',
                // 'category_name' => 'required|string|max:255|unique:issue_categories,category_name',
                'status' => 'required|in:Active,Inactive',
            ] );

            DB::table( 'issue_categories' )->insert( [
                'department_id' => $request->DepartmentId,
                'category_name' => $request->category_name,
                'description' => $request->description ?? null,
                'status' => $request->status ?? 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ] );

            return response()->json( [
                'status' => true,
                'message' => 'Issues Category created successfully'
            ] );
        } catch ( \Exception $e ) {
            return response()->json( [
                'status' => false,
                'message' => $e->getMessage()
            ] );
        }
    }

    public function show( $id ) {
        $data = DB::table( 'issue_categories' )
        ->where( 'category_id', $id )
        ->first();

        return response()->json( [
            'status' => true,
            'data' => $data
        ] );
    }

    public function update( Request $request, $id ) {
        try {
            $request->validate( [
                'category_name' => 'required|string|max:255|unique:issue_categories,category_name,' . $id . ',category_id',
                'status' => 'required|in:Active,Inactive',
            ] );

            DB::table( 'issue_categories' )
            ->where( 'category_id', $id )
            ->update( [
                'category_name' => $request->category_name,
                'status' => $request->status,
                'updated_at' => now(),
            ] );

            return response()->json( [
                'status' => true,
                'message' => 'Updated successfully'
            ] );
        } catch ( \Exception $e ) {
            return response()->json( [
                'status' => false,
                'message' => $e->getMessage()
            ] );
        }
    }

    public function destroy( $id ) {
        DB::table( 'issue_categories' )
        ->where( 'category_id', $id )
        ->delete();

        return response()->json( [
            'status' => true,
            'message' => 'Deleted successfully'
        ] );
    }

}
