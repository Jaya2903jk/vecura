<?php
// app/Http/Controllers/TicketController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{

    public function index(Request $request)
    {
        $q = DB::connection('sqlsrv')->table('issueTicket');

        if ($request->search) {
            $q->where('ticketId', 'like', "%{$request->search}%")
                ->orWhere('department', 'like', "%{$request->search}%");
        }

        if ($request->status) {
            $q->where('status', $request->status);
        }

        $tickets = $q->paginate($request->per_page ?? 10);

        $tickets->getCollection()->transform(function ($item) {
            return [
                'ticket_id'   => $item->ticketId,
                'department'  => $item->Department,
                'issue_type'  => $item->Issuelevel5, // or Subject based on need
                'priority'    => $item->Priority,
                'status'      => $item->Status,
                'created_at'  => $item->CreatedDate,
                'ticket_code'   => $item->TicketCode,
            ];
        });


        return response()->json([
            'status' => true,
            'data' => $tickets
        ]);
    }
    public function show($id)
    {
        $ticket = DB::connection('sqlsrv')
            ->table('issueTicket')
            ->where('ticketId', $id)
            ->first();

        if (!$ticket) {
            return response()->json([
                'status' => false,
                'message' => 'Ticket not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $ticket

        ]);
    }
}
