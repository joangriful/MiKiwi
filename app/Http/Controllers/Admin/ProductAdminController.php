<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductAdminController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return Inertia::render('Admin/ProductAdmin', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug',
            'sku' => 'required|string|max:255|unique:products,sku',
            'base_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'product_type' => 'required|string',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
        ]);

        $product = Product::create($validated);

        return redirect()->back()->with('success', 'Producto creado correctamente en la base de datos.');
    }
}
