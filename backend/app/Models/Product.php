<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes, Sluggable, SluggableScopeHelpers;

    const TYPE_DISCOUNT = [
        'percentage',
        'fixed'
    ];

    protected $fillable = [
        'thumbnail',
        'name',
        'content',
        'category_id',
        'is_active',
        'is_hot_deal',
        'is_new',
        'type_discount',
        'discount',
        'price',
        'price_sale',
        'quantity',
        'sku',
        'total_review',
        'avg_stars',
        'public_id',
        'slug'
    ];

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function galleries(){
        return $this->hasMany(Gallery::class);
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }

}
