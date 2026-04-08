<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientPersonalDetail extends Model {
    //
    protected $table = 'Patient_Personal_Details';
    // exact table name

    protected $primaryKey = 'PatientID';
    public $incrementing = false;
    // because PatientID is string
    protected $keyType = 'string';

    public $timestamps = false;
    // since custom CreatedDate/ModifiedDate used
    protected $fillable = [
        'PatientID',
        'RegistrationDate',
        'RegistrationNo',
        'RegisteredHour',
        'RegisteredTime',
        'Title',
        'Sex',
        'FirstName',
        'LastName',
        'Street',
        'Area',
        'City',
        'State',
        'Country',
        'PinCode',
        'Res_Telephone',
        'Off_Telephone',
        'Mobile',
        'EMail',
        'DateOfBirth',
        'Age',
        'Marital_Status',
        'Wedding_Day',
        'Occupation',
        'Ref_By_Patient',
        'Complaints',
        'Remarks',
        'Photo',
        'Doctorname',
        'Knownby',
        'Loc_Id',
        'CreatedBy',
        'CreatedDate',
        'ModifiedBy',
        'ModifiedDate',
        'SpecialDisPercentage',
        'ServiceDisPercentage',
        'SpecialDiscount',
        'Type',
        'TypeChangedDate',
        'RegTypeId',
        'smsAlert',
        'emailAlert',
        'CustomerStatus',
        'CustomerRemarks',
        'Walkin',
        'BillVersion',
        'AFTIncentive',
        'AFTIncentiveDate',
        'AllOccupation',
        'TreatmentJoined',
        'TreatmentJoinedDate',
        'GoogleReview',
        'GoogleReviewLink',
        'OnlineConsultation',
        'Nontreatable',
        'ONSDeliveryAddress',
        'Whatsapp',
        'WhatsappMobile',
        'TreatmentJoinedBillNo',
        'PANNumber',
        'AadharNumber'
    ];
}
