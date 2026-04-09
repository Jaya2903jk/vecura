<?php

namespace App\Models;

use App\Models\ApprovalFlow;
use Illuminate\Database\Eloquent\Model;
use App\Models\IssueDepartment;
use App\Models\IssueCategory;

class IssueMaster extends Model {
    //
    protected $table = 'issueMasterTest';

    protected $primaryKey = 'IssueId';

    public $timestamps = false;

     public function approvalFlows() {
        return $this->hasMany(ApprovalFlow::class, 'issueId', 'IssueId')->orderBy('levelOrder');
    }

    public function department() {
        return $this->belongsTo(IssueDepartment::class, 'DepartmentId', 'Departmentid');
    }

    public function category() {
        return $this->belongsTo(IssueCategory::class, 'CategoryId', 'category_id');
    }
}
