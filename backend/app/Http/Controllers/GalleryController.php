<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::orderBy('created_at', 'desc')->get();
        return response()->json($galleries);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'image_file' => 'required|image|max:10240', // max 10MB
        ]);

        $data = $request->only(['title', 'category', 'location']);

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filenameWebp = uniqid() . '.webp';
            $pathWebp = storage_path('app/public/galleries/' . $filenameWebp);
            
            if (!file_exists(storage_path('app/public/galleries'))) {
                mkdir(storage_path('app/public/galleries'), 0755, true);
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
                $sourcePath = escapeshellarg($file->getRealPath());
                $destPath = escapeshellarg($pathWebp);
                exec("cwebp -q 80 $sourcePath -o $destPath", $output, $returnVar);
                if ($returnVar === 0 && file_exists($pathWebp)) {
                    $successWebp = true;
                }
            }

            if ($successWebp) {
                $data['image_url'] = '/storage/galleries/' . $filenameWebp;
            } else {
                $extension = $file->getClientOriginalExtension();
                $filename = uniqid() . '.' . $extension;
                $file->storeAs('galleries', $filename, 'public');
                $data['image_url'] = '/storage/galleries/' . $filename;
            }
        }

        $gallery = Gallery::create($data);

        return response()->json(['message' => 'Gallery item created successfully', 'gallery' => $gallery]);
    }

    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);
        if ($gallery->image_url && Str::startsWith($gallery->image_url, '/storage/')) {
            $path = str_replace('/storage/', '', $gallery->image_url);
            Storage::disk('public')->delete($path);
        }
        $gallery->delete();
        return response()->json(['message' => 'Gallery item deleted successfully']);
    }
}
