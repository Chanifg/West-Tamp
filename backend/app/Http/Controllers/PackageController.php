<?php

namespace App\Http\Controllers;

use App\Models\TubingPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;

class PackageController extends Controller
{
    public function index()
    {
        return response()->json(
            TubingPackage::with('features')
                ->latest()
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'required|string',
            'price'         => 'required|numeric|min:0',
            'is_popular'    => 'nullable',
            'image_file'    => 'nullable|image|max:10240',
            'features'      => 'nullable|array',
            'features.*'    => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {

            $data = $request->only([
                'name',
                'description',
                'price'
            ]);

            $data['is_popular'] = filter_var(
                $request->is_popular,
                FILTER_VALIDATE_BOOLEAN
            );

            if ($request->hasFile('image_file')) {
                $data['image_url'] = $this->handleImageUpload(
                    $request->file('image_file')
                );
            }

            $package = TubingPackage::create($data);

            foreach ($request->features ?? [] as $index => $feature) {

                if (trim($feature) == '') {
                    continue;
                }

                $package->features()->create([
                    'feature' => $feature,
                    'sort_order' => $index + 1
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Package created successfully',
                'package' => $package->load('features')
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage()
            ],500);

        }
    }

    public function show($id)
    {
        return response()->json(
            TubingPackage::with('features')
                ->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $package = TubingPackage::findOrFail($id);

        $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'required|string',
            'price'         => 'required|numeric|min:0',
            'is_popular'    => 'nullable',
            'image_file'    => 'nullable|image|max:10240',
            'features'      => 'nullable|array',
            'features.*'    => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {

            $data = $request->only([
                'name',
                'description',
                'price'
            ]);

            $data['is_popular'] = filter_var(
                $request->is_popular,
                FILTER_VALIDATE_BOOLEAN
            );

            if ($request->hasFile('image_file')) {

                if (
                    $package->image_url &&
                    Str::startsWith($package->image_url, '/storage/packages/')
                ) {
                    Storage::disk('public')->delete(
                        str_replace('/storage/', '', $package->image_url)
                    );
                }

                $data['image_url'] = $this->handleImageUpload(
                    $request->file('image_file')
                );
            }

            $package->update($data);

            // hapus semua feature lama
            $package->features()->delete();

            // insert ulang
            foreach ($request->features ?? [] as $index => $feature) {

                if (trim($feature) == '') {
                    continue;
                }

                $package->features()->create([
                    'feature' => $feature,
                    'sort_order' => $index + 1
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Package updated successfully',
                'package' => $package->load('features')
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage()
            ],500);

        }
    }

    public function destroy($id)
    {
        $package = TubingPackage::findOrFail($id);

        if ($package->bookings()->count() > 0) {
            return response()->json([
                'message' => 'Tidak dapat menghapus paket yang sudah memiliki data pesanan.'
            ],422);
        }

        if (
            $package->image_url &&
            Str::startsWith($package->image_url, '/storage/packages/')
        ) {
            Storage::disk('public')->delete(
                str_replace('/storage/', '', $package->image_url)
            );
        }

        $package->delete();

        return response()->json([
            'message' => 'Package deleted successfully'
        ]);
    }

    private function handleImageUpload($file)
    {
        $filenameWebp = uniqid().'.webp';

        $directory = 'packages';

        $fullDir = storage_path('app/public/'.$directory);

        if (!file_exists($fullDir)) {
            mkdir($fullDir,0755,true);
        }

        $pathWebp = $fullDir.'/'.$filenameWebp;

        $successWebp = false;

        if (function_exists('imagewebp')) {

            try {

                $manager = new ImageManager(new Driver());

                $image = $manager->read($file);

                $encoded = $image->encode(new WebpEncoder(quality:80));

                file_put_contents($pathWebp,$encoded->toString());

                $successWebp = true;

            } catch (\Exception $e) {

                \Log::error($e->getMessage());

            }

        }

        if ($successWebp) {

            return '/storage/'.$directory.'/'.$filenameWebp;

        }

        $filename = uniqid().'.'.$file->getClientOriginalExtension();

        $file->storeAs($directory,$filename,'public');

        return '/storage/'.$directory.'/'.$filename;
    }
}