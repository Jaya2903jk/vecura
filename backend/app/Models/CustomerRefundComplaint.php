<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerRefundComplaint extends Model {
    protected $table = 'CustomerRefundComplaint';
    protected $primaryKey = 'complaintid';
    public $timestamps = false;
    // Since you have CreatedDate and ModifiedDate manually

    protected $fillable = [
        'ReferenceNo',
        'CustomerCode',
        'CustomerName',
        'feedbackDate',
        'feedback',
        'CreatedBy',
        'CreatedDate',
        'ModifiedBy',
        'ModifiedDate',
        'alternateMobile',
        'callAssignTo',
        'sources',
        'Complaint',
        'callStatus',
        'followupStatus',
        'CorporateConsultant',
        'ConsultantRemarks',
        'TypeofEscalation',
        'ticketId'
    ];

    public function ticket() {
        return $this->belongsTo( IssueTicket::class, 'ticketId', 'ticketId' );
    }
}
