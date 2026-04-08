<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationMaster extends Model
{
    protected $connection = 'sqlsrv';
    protected $table = 'LocationMaster';
    protected $primaryKey = 'LocationID';
    public $timestamps = false;

    protected $fillable = [
        'LocationName', 'LocationCode', 'LocationAddress', 'StateCode', 'CityCode', 'LocPinCode', 'ZoneState'
    ];
}
