<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'total_price',
        'status_id',
        'receiver_name',
        'receiver_email',
        'receiver_phone',
        'receiver_city',
        'receiver_county',
        'receiver_district',
        'receiver_address',
        'discount_code'
    ];
}
