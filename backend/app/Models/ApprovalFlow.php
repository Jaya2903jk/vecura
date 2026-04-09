<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApprovalFlow extends Model {
    protected $table = 'ApprovalFlows';
    protected $primaryKey = 'flowId';
    public $timestamps = false;
    protected $fillable = ['issueId', 'levelOrder', 'roleId', 'levelName', 'status', 'note'];

    public function issue() {
        return $this->belongsTo(IssueMaster::class, 'issueId', 'IssueId');
    }
}
