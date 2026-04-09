<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserGroupMaster extends Model
{
    protected $table = 'User_Group_Master'; // table name
    protected $primaryKey = 'UserGroupID';  // primary key
    public $timestamps = false;             // no created_at / updated_at

    protected $fillable = [
        'UserGroupID',      // e.g., 13
        'UserGroupName',    // e.g., Admin
        'Description',      // optional
    ];

    // Optional: define relation to users
    public function users()
    {
        return $this->hasMany(UserMaster::class, 'UserGroupCode', 'UserGroupID');
    }
}
