<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
    public function searchCustomer(Request $req)
    {
        $data = DB::table('Patient_Personal_Details')
            ->where('RegistrationNo', 'LIKE', "%{$req->search}%")
            // ->orWhere('PatientName', 'LIKE', "%{$req->search}%")
            ->limit(10)
            ->get();

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
