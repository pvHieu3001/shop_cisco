<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Category;
use App\Enums\Categories;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code')->unique();
            $table->text('image')->nullable();
            $table->string('public_id')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('categories');
            $table->boolean('is_active')->default(true);
            $table->softDeletes('deleted_at')->nullable();
            $table->timestamps();
        });

        foreach (Categories::getValues() as $cat) {
            Category::create([
                'name' => $cat,
                'code' =>Categories::getSlug($cat)
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
