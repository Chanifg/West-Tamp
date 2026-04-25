<?php

namespace App\Http\Controllers;

use App\Models\TubingPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class PackageController extends Controller
{
    public function index()
    {
        return response()->json(TubingPackage::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_popular' => 'nullable',
            'image_file' => 'nullable|image|max:10240',
        ]);

        $data = $request->only(['name', 'description', 'price']);
        $data['is_popular'] = filter_var($request->is_popular, FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('image_file')) {
            $data['image_url'] = $this->handleImageUpload($request->file('image_file'));
        }

        $package = TubingPackage::create($data);

        return response()->json([
            'message' => 'Package created successfully',
            'package' => $package
        ], 201);
    }

    public function show($id)
    {
        $package = TubingPackage::findOrFail($id);
        return response()->json($package);
    }

    public function update(Request $request, $id)
    {
        $package = TubingPackage::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_popular' => 'nullable',
            'image_file' => 'nullable|image|max:10240',
        ]);

        $data = $request->only(['name', 'description', 'price']);
        $data['is_popular'] = filter_var($request->is_popular, FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('image_file')) {
            // Delete old image if exists
            if ($package->image_url && Str::startsWith($package->image_url, '/storage/packages/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $package->image_url));
            }
            $data['image_url'] = $this->handleImageUpload($request->file('image_file'));
        }

        $package->update($data);

        return response()->json([
            'message' => 'Package updated successfully',
            'package' => $package
        ]);
    }

    public function destroy($id)
    {
        $package = TubingPackage::findOrFail($id);

        // Check if package has bookings
        if ($package->bookings()->count() > 0) {
            return response()->json([
                'message' => 'Tidak dapat menghapus paket yang sudah memiliki data pesanan. Silakan hubungi developer untuk penghapusan manual jika diperlukan.'
            ], 422);
        }

        // Delete image if exists
        if ($package->image_url && Str::startsWith($package->image_url, '/storage/packages/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $package->image_url));
        }

        $package->delete();

        return response()->json([
            'message' => 'Package deleted successfully'
        ]);
    }

    private function handleImageUpload($file)
    {
        $filenameWebp = uniqid() . '.webp';
        $directory = 'packages';
        $fullDir = storage_path('app/public/' . $directory);
        
        if (!file_exists($fullDir)) {
            mkdir($fullDir, 0755, true);
        }

        $pathWebp = $fullDir . '/' . $filenameWebp;
        $successWebp = false;

        if (function_exists('imagewebp')) {
            try {
                $manager = new ImageManager(new Driver());
                $image = $manager->decodePath($file->getRealPath());
                $encoded = $image->encode(new \Intervention\Image\Encoders\WebpEncoder(quality: 80));
                file_put_contents($pathWebp, $encoded->toString());
                $successWebp = true;
            } catch (\Exception $e) {
                \Log::error("WebP conversion failed: " . $e->getMessage());
            }
        }

        if ($successWebp) {
            return '/storage/' . $directory . '/' . $filenameWebp;
        } else {
            $extension = $file->getClientOriginalExtension();
            $filename = uniqid() . '.' . $extension;
            $file->storeAs($directory, $filename, 'public');
            return '/storage/' . $directory . '/' . $filename;
        }
    }
}
