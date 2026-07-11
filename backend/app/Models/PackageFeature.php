<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageFeature extends Model
{
    protected $fillable = [
        'tubing_package_id',
        'feature',
        'sort_order',
    ];

    public function package()
    {
        return $this->belongsTo(TubingPackage::class);
    }
}
