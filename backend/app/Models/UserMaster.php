<?php

namespace App\Models;

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
}
