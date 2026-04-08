<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IssueDepartment extends Model {
    //
    protected $table = 'issueDepartmentMaster';

    protected $primaryKey = 'Departmentid';

    public $timestamps = false;
    protected $fillable = [
        'DepartmentName'
    ];
}
