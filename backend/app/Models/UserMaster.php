<?php

namespace App\Models;

use App\Models\UserGroupMaster;
use Illuminate\Database\Eloquent\Model;

class UserMaster extends Model {
    protected $table = 'User_Master';

    protected $primaryKey = 'UserID';

    public $timestamps = false;

    protected $fillable = [
        'UserCode',
        'UserName',
        'Password',
        'FullName',
        'Loc_id',
        'CreatedBy',
        'CreatedDate',
        'ModifiedBy',
        'ModifiedDate',
        'UserGroupCode',
        'UserStatus',
        'ConsultantCode',
        'NewStatus',
        'IsNewUser',
        'EmailId',
        'SuberAdmin',
        'BlockedUserAccessDate',
        'AFTsms',
        'IPUser',
        'BlockUserLogin',
        'LastPwUpdate',
        'LoginAccess',
        'DasboardView',
        'notLogin',
        'LoginDateExtend',
        'LoginTimeExtend',
        'PublicIPDateExtend',
        'PublicIPTimeExtend',
        'Designation',
        'stateType',
        'ViewFlag',
        'CommonCode',
        'schedulepending',
        'Report',
        'LogoutTimeExtend',
        'popupWin',
        'headLocationGroup',
        'headsStatus',
        'POSignature',
        'team',
        'headsType'
    ];
    // App\Models\UserMaster.php

    public function userGroup() {
        // Match UserGroupCode to UserGroupMaster.UserGroupCode
        return $this->belongsTo( UserGroupMaster::class, 'UserGroupCode', 'UserGroupCode' );
    }

}
