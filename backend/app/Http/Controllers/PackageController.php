<?php

namespace App\Http\Controllers;

use App\Models\TubingPackage;
use Illuminate\Http\Request;

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
        ]);

        $package = TubingPackage::create($request->all());

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
        ]);

        $package->update($request->all());

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

        $package->delete();

        return response()->json([
            'message' => 'Package deleted successfully'
        ]);
    }
}
