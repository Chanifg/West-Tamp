<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::orderBy('created_at', 'desc')->get();
        return response()->json($blogs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'content' => 'required|string',
            'author' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'image_file' => 'nullable|image|max:5120',
            'image_url' => 'nullable|string'
        ]);

        $data = $request->except(['image_file']);
        $data['slug'] = Str::slug($request->title) . '-' . uniqid();
        $data['is_featured'] = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = uniqid() . '.webp';
            
            $manager = new ImageManager(new Driver());
            $image = $manager->read($file->getRealPath());
            $encoded = $image->toWebp(80);
            
            Storage::disk('public')->put('blogs/' . $filename, $encoded->toString());
            $data['image_url'] = '/storage/blogs/' . $filename;
        }

        $blog = Blog::create($data);

        return response()->json(['message' => 'Blog created successfully', 'blog' => $blog]);
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        if ($blog->image_url && Str::startsWith($blog->image_url, '/storage/')) {
            $path = str_replace('/storage/', '', $blog->image_url);
            Storage::disk('public')->delete($path);
        }
        $blog->delete();
        return response()->json(['message' => 'Blog deleted successfully']);
    }
}
