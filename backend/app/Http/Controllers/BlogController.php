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
            
            $filenameWebp = uniqid() . '.webp';
            $pathWebp = storage_path('app/public/blogs/' . $filenameWebp);
            
            if (!file_exists(storage_path('app/public/blogs'))) {
                mkdir(storage_path('app/public/blogs'), 0755, true);
            }

            $successWebp = false;

            if (function_exists('imagewebp')) {
                try {
                    $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
                    $image = $manager->decodePath($file->getRealPath());
                    $encoded = $image->encode(new \Intervention\Image\Encoders\WebpEncoder(quality: 80));
                    file_put_contents($pathWebp, $encoded->toString());
                    $successWebp = true;
                } catch (\Exception $e) {
                    $successWebp = false;
                }
            }
            
            if (!$successWebp) {
                // Try using cwebp CLI utility
                $sourcePath = escapeshellarg($file->getRealPath());
                $destPath = escapeshellarg($pathWebp);
                exec("cwebp -q 80 $sourcePath -o $destPath", $output, $returnVar);
                if ($returnVar === 0 && file_exists($pathWebp)) {
                    $successWebp = true;
                }
            }

            if ($successWebp) {
                $data['image_url'] = '/storage/blogs/' . $filenameWebp;
            } else {
                // Fallback to original format
                $extension = $file->getClientOriginalExtension();
                $filename = uniqid() . '.' . $extension;
                $file->storeAs('blogs', $filename, 'public');
                $data['image_url'] = '/storage/blogs/' . $filename;
            }
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

    public function show($slug)
    {
        $blog = Blog::where('slug', $slug)->firstOrFail();
        return response()->json($blog);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'content' => 'required|string',
            'author' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'image_file' => 'nullable|image|max:5120',
        ]);

        $data = $request->except(['image_file']);
        
        // Update slug only if title changes
        if ($blog->title !== $request->title) {
            $data['slug'] = Str::slug($request->title) . '-' . uniqid();
        }
        
        $data['is_featured'] = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('image_file')) {
            // Delete old image if exists
            if ($blog->image_url && Str::startsWith($blog->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $blog->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $file = $request->file('image_file');
            $filenameWebp = uniqid() . '.webp';
            $pathWebp = storage_path('app/public/blogs/' . $filenameWebp);
            
            if (!file_exists(storage_path('app/public/blogs'))) {
                mkdir(storage_path('app/public/blogs'), 0755, true);
            }

            $successWebp = false;
            if (function_exists('imagewebp')) {
                try {
                    $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
                    $image = $manager->decodePath($file->getRealPath());
                    $encoded = $image->encode(new \Intervention\Image\Encoders\WebpEncoder(quality: 80));
                    file_put_contents($pathWebp, $encoded->toString());
                    $successWebp = true;
                } catch (\Exception $e) {}
            }
            
            if (!$successWebp) {
                exec("cwebp -q 80 " . escapeshellarg($file->getRealPath()) . " -o " . escapeshellarg($pathWebp), $output, $returnVar);
                if ($returnVar === 0 && file_exists($pathWebp)) {
                    $successWebp = true;
                }
            }

            if ($successWebp) {
                $data['image_url'] = '/storage/blogs/' . $filenameWebp;
            } else {
                $extension = $file->getClientOriginalExtension();
                $filename = uniqid() . '.' . $extension;
                $file->storeAs('blogs', $filename, 'public');
                $data['image_url'] = '/storage/blogs/' . $filename;
            }
        }

        $blog->update($data);

        return response()->json(['message' => 'Blog updated successfully', 'blog' => $blog]);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        $file = $request->file('image');
        $filename = uniqid() . '.webp';
        $path = storage_path('app/public/content/' . $filename);

        if (!file_exists(storage_path('app/public/content'))) {
            mkdir(storage_path('app/public/content'), 0755, true);
        }

        $success = false;
        if (function_exists('imagewebp')) {
            try {
                $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
                $image = $manager->decodePath($file->getRealPath());
                $encoded = $image->encode(new \Intervention\Image\Encoders\WebpEncoder(quality: 80));
                file_put_contents($path, $encoded->toString());
                $success = true;
            } catch (\Exception $e) {}
        }
        
        if (!$success) {
            exec("cwebp -q 80 " . escapeshellarg($file->getRealPath()) . " -o " . escapeshellarg($path), $output, $returnVar);
            if ($returnVar === 0 && file_exists($path)) {
                $success = true;
            }
        }

        if ($success) {
            $url = '/storage/content/' . $filename;
        } else {
            $extension = $file->getClientOriginalExtension();
            $filename = uniqid() . '.' . $extension;
            $file->storeAs('content', $filename, 'public');
            $url = '/storage/content/' . $filename;
        }

        return response()->json(['url' => $url, 'markdown' => '![image](' . $url . ')']);
    }
}
