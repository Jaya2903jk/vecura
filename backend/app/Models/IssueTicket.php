<?php

namespace App\Models;

use App\Models\CustomerRefundComplaint;
use App\Models\IssueDepartment;
use App\Models\LocationMaster;
use App\Models\PatientPersonalDetail;
use Illuminate\Database\Eloquent\Model;

class IssueTicket extends Model {
    protected $connection = 'sqlsrv';
    // ✅ important
    protected $table = 'issueTicket';
    protected $primaryKey = 'ticketId';
    public $timestamps = false;
    // you are using CreatedDate manually

    protected $fillable = [
        'Subject',
        'Branch',
        'Department',
        'Brief',
        'Status',
        'Priority',
        'Issuelevel1',
        'Issuelevel2',
        'Issuelevel3',
        'Issuelevel4',
        'Issuelevel5',
        'AcceptedBy',
        'RequiredTime',
        'RequiredTimeType',
        'CreatedBy',
        'CreatedDate',
        'ModifiedBy',
        'ModifiedDate',
        'AttachFile',
        'CustomerCode',
        'BllNo',
        'BillAmount',
        'ProductName',
        'DiscPerc',
        'BillDate',
        'ConsultantName',
        'FromProduct',
        'ToProduct',
        'BankName',
        'CardNo',
        'CashAmt',
        'CardAmt',
        'ScheduledDate',
        'NewSchedulingDate',
        'NewConsultantName',
        'BillRaisedType',
        'NewBillType',
        'ProductCode',
        'ServiceCode',
        'ServiceName',
        'DiscountAmt',
        'LocId',
        'ScheduledType',
        'ReceiptDate',
        'ReceiptNo',
        'BillNoFrom',
        'BillNoTo',
        'NewRequestedBillDate',
        'BillType',
        'CustomerName',
        'OriyanaId',
        'MobileNo',
        'EmpName',
        'ApprovedStatus',
        'ApprovedBy',
        'Email',
        'scheduleCode',
        'BillReceiptNo',
        'BillReceiptDate',
        'OldSerProName',
        'NewSerProName',
        'NewSerProCode',
        'TotalBilledAmt',
        'AdvancePaidAmt',
        'AdvanceDiscountPer',
        'AdvanceDiscountAmt',
        'AdvanceQty',
        'AdvanceNetAmount',
        'RefundCreditAmount',
        'Advancerate',
        'TicketCode',
        'customerMobile',
        'attachmentpath',
        'OriginalFileaname',
        'DiscQty',
        'fromLocation',
        'ToLocation',
        'UserId',
        'accesstype',
        'DiscountPaymentMode',
        'type'
    ];

    public function complaints() {
        return $this->hasMany( CustomerRefundComplaint::class, 'ticketId', 'ticketId' );
    }

    public function customer() {
        return $this->belongsTo(
            PatientPersonalDetail::class,
            'CustomerCode',     // FK in issueTicket
            'RegistrationNo'    // PK in Patient_Personal_Details
        );
    }

    public function department() {
        return $this->belongsTo(
            IssueDepartment::class,
            'Department',     // foreign key in issueTicket
            'Departmentid'    // primary key in issueDepartmentMaster
        );
    }

    public function location() {
        return $this->belongsTo( LocationMaster::class, 'Branch', 'LocationCode' );
    }
}
