<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\Product;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Helpers\Validator as IValidator;

class ProductController extends Controller
{

    const FOLDER = 'developer';

    public function index(){
        try {

            $products = Product::with(['category'])->orderBy('id', 'DESC')->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ], 200);

        }catch (\Exception $exception){

            return response()->json([
                'success' => false,
                'message' => $exception->getMessage()
            ]);

        }
    }

    public function featProducts(Request $request){
        try{
            $products = Product::where($request->feat, true)->get();
            return response()->json([
                'success' => true,
                'data' => $products
            ], 200);
        }catch (\Exception $exception){
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage()
            ]);
        }
    }

    public function catProducts(Request $request){
        try{
            $cat = $request->cat;
            $products = Product::whereHas('category', function ($query) use ($cat) {
                $query->where('code', 'like', '%' . $cat . '%');
            })->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ], 200);
        }catch (\Exception $exception){
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage()
            ]);
        }
    }

    public function filterProducts(Request $request){
        $search = request('search');
        try{
            $products = Product::with(['category'])
            ->where('category.name', 'LIKE', '%' . $search . '%')
            ->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ], 200);
        }catch (\Exception $exception){
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage()
            ]);
        }
    }

    public function getGalleries(Request $request){
        try {
            $product = Product::where('slug', $request->slug)->firstOrFail();

            if(!$product){
                return response()->json([
                    'success' => true,
                    'message' => 'Không thể tìm thấy sản phẩm'
                ], 404);
            }

            $galleries = Gallery::where('product_id', $product->id)->get();

            return response()->json([
                'success' => true,
                'data' => $galleries
            ], 200);
        }catch (\Exception $exception){
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage()
            ]);
        }
    }

    public function show(Request $request){

        try {
            $product = Product::where('slug', $request->slug)->firstOrFail();

            if(!$product){
                return response()->json([
                    'success' => true,
                    'message' => 'Không thể tìm thấy sản phẩm'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => $product
            ], 200);
        }catch (\Exception $exception){
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage()
            ]);
        }
    }

    public function store(Request $request){

        $valid = Validator::make($request->all(),[
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            "name" => "required|max:155|min:10",
            "content" => "required",
            "category_id" => "required",
            "is_active" => "required",
        ],
            [
                "thumbnail" => "Sản phẩm phải có ảnh đại diện",
                "thumbnail.image" => 'thumbnail phải là ảnh',
                "thumbnail.mimes" => 'định dạng cu thumbnail là jpeg, png, jpg, gif',
                "name" => "Trường name phải bắt buộc",
                "name.min" => "Tên sản phẩm phải hơn 10 ký tự",
                "name.max" => "Tên sản phẩm không được vượt quá 155 ký tự",
                "content" => "Chưa có nội dung giới thiệu sản phẩm",
                "category_id" => "Chưa có danh mục",
                "is_active" => "Chưa lựa chọn loại hiển thị",
            ]
        );

        if($valid->fails()){
            return response()->json([
                'success' => false,
                'message' => $valid->errors()
            ], 200);
        }

        $name = $request->get("name");
        $content = $request->get("content");
        $category_id = $request->get("category_id");
        $is_active = $request->get("is_active") == 1 ? 1 : 0;
        $is_hot_deal = $request->get("is_hot_deal") == 1 ? 1 : 0;
        $is_new = $request->get("is_new") == 1 ? 1 : 0;
        $quantity = $request->get("quantity");
        $price = $request->get("price");
        $price_sale = $request->get("price_sale");
        $sku = $request->get("sku");
        $type_discount = $request->get("type_discount") ? $request->get("type_discount") : null;
        $discount = $request->get("discount") ? $request->get("discount") : null;
        $gallery = json_decode($request->get('gallery'));


        try{
            DB::beginTransaction();

            $thumbnail = $request->file('thumbnail');
            $fileName = $thumbnail->getClientOriginalName() . '-' . time() . '.' . rand(1, 1000000);

            $url = Cloudinary::upload($thumbnail->getRealPath(), [
                'folder' => self::FOLDER,
                'public_id' => $fileName
            ])->getSecurePath();

            $public_id = Cloudinary::getPublicId();

            $product = Product::create([
                'thumbnail' => $url,
                'name' => $name,
                'content' => $content,
                'category_id' => $category_id,
                'is_active' => $is_active,
                'is_hot_deal' => $is_hot_deal,
                'is_new' => $is_new,
                'type_discount' => $type_discount,
                'discount' => $discount,
                'quantity' => $quantity,
                'price' => $price,
                'price_sale' => $price_sale,
                'sku' => $sku,
                'public_id' => $public_id,
            ]);

            foreach ($gallery as $key => $item) {
                $image = $item->image;

                $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $image);
                $imageData = base64_decode($imageData);

                $tempImagePath = storage_path('app/temp_image.jpg');
                file_put_contents($tempImagePath, $imageData);

                $url_gallery = Cloudinary::upload($tempImagePath, [
                    'folder' => self::FOLDER,
                    'public_id' => "$name-$key".rand(1, 1000000)
                ])->getSecurePath();

                $public_id = Cloudinary::getPublicId();

                unlink($tempImagePath);

                Gallery::create([
                    'product_id' => $product->id,
                    'image' => $url_gallery,
                    'public_id' => $public_id,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Product added successfully!',
                'data' => $product->id,
            ]);

        }catch (\Exception $exception){
            DB::rollBack();
            return response()->json([
                "success" => false,
                "message" => $exception->getMessage()
            ], 500);
        }
    }
}
