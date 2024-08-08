<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Gallery extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'galleries';

    protected $fillable = [
        'product_id',
        'image',
        'public_id'
    ];

    public function product(){
        return $this->belongsTo(Product::class);
    }
}
