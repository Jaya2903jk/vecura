<?php
// app/Http/Controllers/TicketController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\CustomerRefundComplaint;
use App\Models\IssueDepartment;
use App\Models\IssueCategory;
use App\Models\IssueMaster;
use App\Models\PatientPersonalDetail;
use App\Models\UserMaster;
use App\Models\IssueTicket;
use App\Models\ApprovalFlow;

use Carbon\Carbon;

class TicketController extends Controller
{

    public function index(Request $request)
    {
        $q = IssueTicket::with(['department', 'customer', 'location', 'complaints'])
            ->withCount([
                'complaints as pending_count' => function ($query) {
                    $query->where('callStatus', 'pending');
                },
                'complaints as inprogress_count' => function ($query) {
                    $query->where('callStatus', 'InProgress');
                },
                'complaints as closed_count' => function ($query) {
                    $query->where('callStatus', 'Closed');
                },
            ]);

        if ($request->type) {
            if ($request->type === 'ticket') {
                $q->where(function ($query) {
                    $query->where('type', 'ticket')
                        ->orWhereNull('type');
                });
            } else {
                $q->where('type', 'complaint');
            }
        }

        if ($request->search) {
            $q->where(function ($query) use ($request) {
                $query->where('TicketCode', 'like', "%{$request->search}%")
                    ->orWhere('CustomerName', 'like', "%{$request->search}%")
                    ->orWhereHas('customer', function ($q2) use ($request) {
                        $q2->where('RegistrationNo', 'like', "%{$request->search}%");
                    });
            });
        }
        if ($request->status !== null && $request->status !== '') {
            $q->where('Status', $request->status);
        }

        if ($request->priority) {
            $q->where('Priority', $request->priority);
        }
        if ($request->location) {
            $q->where('Branch', $request->location); // use Branch, not LocId
        }

        $tickets = $q->orderBy('ticketId', 'desc')
            ->paginate($request->per_page ?? 10);

        $tickets->getCollection()->transform(function ($t) {
            return [
                'ticket_id'   => $t->ticketId,
                'ticket_code' => $t->TicketCode,
                'department'  => $t->department->DepartmentName ?? '-',
                'reg_no'      => $t->customer->RegistrationNo ?? '-',
                'location'    => $t->location->LocationName ?? '-', // relation uses Branch
                'issue_type'  => $t->Issuelevel5 ?? $t->Subject,
                'priority'    => $t->Priority,
                'status'      => $t->Status,
                'created_at'  => $t->CreatedDate,
                'type'        => $t->type ?? 'ticket',
                // 'customer'    => $t->CustomerName,
                'pending_count'    => $t->pending_count,
                'inprogress_count' => $t->inprogress_count,
                'closed_count'     => $t->closed_count,
            ];
        });

        return response()->json([
            'status' => true,
            'data'   => $tickets
        ]);
    }
    public function store(Request $request)
    {
        // return response()->json($request->all());
        $request->validate([
            'DepartmentId' => 'required|integer',
            'description' => 'required|string',
            'Source' => 'nullable|string',
            'customer_code' => 'nullable|string',
            'customer_name' => 'nullable|string',
            'alternate_mobile' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {

            $patient = PatientPersonalDetail::where('RegistrationNo', $request->customer_code)->first();
            $user = UserMaster::find($request->auth_user_id);
            // return response()->json($patient);
            $department = IssueDepartment::find($request->DepartmentId);
            $category   = IssueCategory::find($request->category);
            $issue      = IssueMaster::find($request->issue);

            $userCode = $user->UserCode;
            $ticket = IssueTicket::where('CustomerCode', $request->customer_code)
                ->where('Status', 0) // pending/open tickets only
                ->first();
            if (!$ticket) {
                $ticketId = DB::connection('sqlsrv')
                    ->table('issueTicket')
                    ->insertGetId([
                        'Department'   => $request->DepartmentId,
                        'Subject'      => $category->category_name ?? null,
                        'Issuelevel2'  => $category->category_name ?? null,
                        'Issuelevel3'  => $category->category_name ?? null, // ✅ ADD THIS
                        'Issuelevel5'  => $category->category_name ?? null,
                        'CustomerCode' => $request->customer_code,
                        'CustomerName' => $request->customer_name,
                        'LocId' => $user->Loc_id ?: ($patient->Loc_Id ?: 1),
                        'Branch' => $user->Loc_id ?: ($patient->Loc_Id ?: 1),
                        'Status'       => 0,
                        'type'         => 'complaint',
                        'CreatedBy'    => $userCode,
                        'CreatedDate'  => now(),
                        'AcceptedBy'   => $userCode,
                        'RequiredTime' => 1,
                        'RequiredTimeType' => 'Day',
                        'AttachFile'   => '',
                        'FromProduct'  => $request->from_product ?? '',
                        'ToProduct'  => $request->ToProduct ?? '',
                        'BankName'  => $request->bank_name ?? '',
                        'CardNo'  => $request->card_no ?? '',
                        'CashAmt'  => $request->cash_amt ?? 0,
                        'CardAmt'  => $request->card_amt ?? 0,
                        'ScheduledDate'  => $request->scheduled_date ?? null,
                        'BillRaisedType'  => $request->bill_raised_type ?? null,
                        'NewBillType'  => $request->new_bill_type ?? null,
                        'ProductCode'  => $request->product_code ?? null,
                        'ServiceCode'  => $request->service_code ?? null,
                        'ServiceName'  => $request->service_name ?? null,
                        'DiscountAmt'  => $request->discount_amt ?? 0,
                        'BillNoFrom'  => $request->bill_no_from ?? '',
                        'BillNoTo'  => $request->bill_no_to ?? '',
                        'NewRequestedBillDate'  => $request->new_requested_bill_date ?? null,
                        'BillType'  => $request->bill_type ?? '',
                        'OriyanaId'  => $request->oriyana_id ?? '',
                        'MobileNo'  => $request->alternate_mobile ?? '',
                        'EmpName'  => $user->UserName ?? '',
                        'ApprovedStatus' => 'Pending',
                        'ApprovedBy' => '',
                        'Email' => $user->Email ?? '',

                    ]);
                $ticket = IssueTicket::find($ticketId);
            }
            $last = CustomerRefundComplaint::orderBy('complaintid', 'desc')->first();
            $next = 1;

            if ($last && $last->ReferenceNo) {
                preg_match('/TRY-(\d+)/', $last->ReferenceNo, $m);
                $next = isset($m[1]) ? (int)$m[1] + 1 : 1;
            }
            $ticketNo = 'TRY-' . str_pad($next, 4, '0', STR_PAD_LEFT);


            $complaint = CustomerRefundComplaint::create([
                'ReferenceNo' => $ticketNo,
                'CustomerCode' => $request->customer_code,
                'CustomerName' => $request->customer_name,
                'feedbackDate' => now(),
                'feedback' => $request->description,
                'CreatedBy' =>  $userCode,
                'CreatedDate' => now(),
                'ModifiedBy' =>  $userCode,
                'ModifiedDate' => now(),
                'alternateMobile' => $request->alternate_mobile,
                'sources' => $request->Source,
                // 'callAssignTo' => $request->DepartmentId,
                // 'DepartmentName' => $department->DepartmentName ?? null,
                'Complaint' => $category->category_name ?? null,
                'TypeofEscalation' => $issue->IssueName ?? null,
                'issue_master_id' => $request->issue,
                'callStatus' => 'Pending',
                'ticketId'   => $ticket->ticketId,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Complaint Created',
                'data' => $complaint,
                'ticket'  => $ticket,
            ]);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {

        $ticket = IssueTicket::with([
            'department',
            'location',
            'customer',
            'complaints.category',
            'complaints.issue',
            'complaints.createdUser',
            'complaints.approvalFlows'
        ])->find($id);

        if (!$ticket) {
            return response()->json([
                'status' => false,
                'message' => 'Ticket not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => [
                'ticketId' => $ticket->ticketId,
                'TicketCode' => $ticket->TicketCode,
                'Department' => $ticket->department->DepartmentName ?? $ticket->Department,
                'Branch' => $ticket->location->LocationName ?? $ticket->Branch,

                'CustomerCode' => $ticket->CustomerCode,
                'CustomerName' => $ticket->CustomerName ?? ($ticket->customer->PatientName ?? ''),
                'mobile' => $ticket->customer->Mobile ?? '',
                'Status' => $ticket->Status,
                'CreatedBy' => $ticket->CreatedBy,
                'AcceptedBy' => $ticket->AcceptedBy,

                'CreatedDate' => $ticket->feedbackDate
                    ? Carbon::parse($ticket->feedbackDate)->format('d-M-Y')
                    : null,
                'Subject' => $ticket->Subject,
                'Brief' => $ticket->Brief,

                'complaints' => $ticket->complaints->map(function ($c) {
                    $approvalFlows = ApprovalFlow::where('issueId', $c->issue_master_id)
                        ->orderBy('levelOrder')
                        ->get(['roleId', 'levelName', 'status', 'note'])
                        ->map(function ($f) {
                            return [
                                'roleId' => $f->roleId,
                                'levelOrder' => $f->levelOrder,
                                'levelName' => $f->levelName,
                                'status' => $f->status,
                                'note' => $f->note,
                            ];
                        });
                    $approvalLevels = $c->approvalFlows->pluck('roleId')->toArray();

                    return [
                        'complaintId' => $c->complaintid,
                        'Category' => $c->category->category_name ?? $c->Complaint,
                        'Issue' => $c->issue->IssueName ?? $c->TypeofEscalation,
                        'sources' => $c->sources ?? '',
                        'Comment' => $c->feedback ?? $c->Complaint,
                        'CreatedBy' => $c->createdUser->FullName ?? $c->CreatedBy,
                        'CreatedDate' => ($c->CreatedDate ?? $c->feedbackDate)
                            ? Carbon::parse($c->CreatedDate ?? $c->feedbackDate)->format('d-M-Y')
                            : null,
                        'Status' => $c->callStatus,
                        'ApprovalFlows' => $approvalFlows,
                        'ApprovalLevels' => $approvalLevels,

                    ];
                })
            ]
        ]);
    }
}
