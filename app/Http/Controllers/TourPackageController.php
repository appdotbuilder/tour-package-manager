<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTourPackageRequest;
use App\Http\Requests\UpdateTourPackageRequest;
use App\Models\TourPackage;
use Inertia\Inertia;

class TourPackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packages = TourPackage::with('bookings')
            ->withCount('bookings')
            ->latest()
            ->paginate(12);
        
        return Inertia::render('tour-packages/index', [
            'packages' => $packages
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('tour-packages/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTourPackageRequest $request)
    {
        $validated = $request->validated();
        $validated['available_slots'] = $validated['max_capacity'];
        
        $package = TourPackage::create($validated);

        return redirect()->route('tour-packages.show', $package)
            ->with('success', 'Tour package created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TourPackage $tourPackage)
    {
        $tourPackage->load(['bookings.agent']);
        
        return Inertia::render('tour-packages/show', [
            'package' => $tourPackage
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TourPackage $tourPackage)
    {
        return Inertia::render('tour-packages/edit', [
            'package' => $tourPackage
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTourPackageRequest $request, TourPackage $tourPackage)
    {
        $tourPackage->update($request->validated());

        return redirect()->route('tour-packages.show', $tourPackage)
            ->with('success', 'Tour package updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TourPackage $tourPackage)
    {
        $tourPackage->delete();

        return redirect()->route('tour-packages.index')
            ->with('success', 'Tour package deleted successfully.');
    }
}