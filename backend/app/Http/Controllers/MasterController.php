<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\UserMaster;
use App\Models\LocationMaster;

class MasterController extends Controller
{
    // 1. Departments

    public function departments()
    {
        $data = DB::table('issueDepartmentMaster')->get();

        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }
    public function issueCategories(Request $request)
    {
        $query = DB::table('issue_categories');
        if ($request->has('department_id') && $request->department_id != '') {
            $query->where('department_id', $request->department_id);
        }
        $data = $query->get();
        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }
    public function getIssuesByCategory($categoryId)
    {
        try {
            $issues = DB::table('IssueMasterTest')
                ->where('CategoryId', $categoryId)
                ->where('Status', 1) // optional: only active issues
                ->select(
                    'IssueId',
                    'DepartmentId',
                    'CategoryId',
                    'IssueName',
                    'Status',
                    'Level1Role',
                    'Level2Role',
                    'Level3Role',
                    'Level4Role',
                    'Level5Role'
                )
                ->get();

            return response()->json([
                'status' => true,
                'data' => $issues
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getRoles()
    {
        $roles = DB::connection('sqlsrv')
            ->table('User_Group_Master')
            ->select('UserGroupID', 'UserGroupName')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $roles
        ]);
    }
    public function levels($departmentId)
    {
        if (!is_numeric($departmentId)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid Department ID'
            ], 400);
        }

        $rows = DB::table('issueMaster')
            ->where('Departmentid', (int)$departmentId)
            ->get();

        $values = [];

        foreach ($rows as $row) {
            if (!empty($row->Issuelevel5)) {
                $values[] = $row->Issuelevel5;
            }
        }

        // remove duplicates
        $values = array_values(array_unique($values));

        return response()->json([
            'status' => true,
            'data' => collect($values)->map(function ($val, $i) {
                return [
                    'id' => $i + 1,
                    'label' => $val
                ];
            })
        ]);
    }
   public function locations()
    {
        $locations = LocationMaster::orderBy('LocationName')->get();

        return response()->json([
            'status' => true,
            'data' => $locations
        ]);
    }
    public function searchCustomer(Request $req)
    {
        $user = UserMaster::find($req->auth_user_id);

        $query = DB::table('Patient_Personal_Details')
            ->where(function ($q) use ($req) {
                $q->where('RegistrationNo', 'LIKE', "%{$req->search}%")
                    ->orWhere('Mobile', 'LIKE', "%{$req->search}%");
            });
        if (!$user->SuberAdmin) {
            $query->where('Loc_id', $user->Loc_id);
        }

        $data = $query->limit(10)->get();

        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }
    public function searchService(Request $req)
    {
        $data = DB::table('Servicemaster')
            ->where('ServiceName', 'LIKE', "%{$req->search}%")
            ->limit(10)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }
}
