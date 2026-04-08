<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IssueCategory extends Model {
    //
    protected $table = 'issue_categories';

    protected $primaryKey = 'category_id';

    public $timestamps = false;
}
