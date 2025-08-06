<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\TourPackage;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        $bookingsQuery = Booking::with(['tourPackage', 'agent']);
        
        // If agent, only show their bookings
        if ($user->isAgent()) {
            $bookingsQuery->where('agent_id', $user->id);
        }
        
        $bookings = $bookingsQuery->latest()->paginate(10);
        
        return Inertia::render('bookings/index', [
            'bookings' => $bookings
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $packages = TourPackage::active()
            ->where('available_slots', '>', 0)
            ->select(['id', 'name', 'price', 'available_slots'])
            ->get();
        
        return Inertia::render('bookings/create', [
            'packages' => $packages
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request)
    {
        $validated = $request->validated();
        $package = TourPackage::findOrFail($validated['tour_package_id']);
        
        // Check availability
        if ($package->available_slots < $validated['number_of_people']) {
            return back()->withErrors([
                'number_of_people' => 'Not enough available slots for this package.'
            ]);
        }
        
        // Calculate totals
        $validated['agent_id'] = auth()->id();
        $validated['total_amount'] = $package->price * $validated['number_of_people'];
        $validated['agent_commission'] = $validated['total_amount'] * 0.1; // 10% commission
        
        $booking = Booking::create($validated);
        
        // Update available slots
        $package->decrement('available_slots', $validated['number_of_people']);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        // Check authorization
        $user = auth()->user();
        if ($user->isAgent() && $booking->agent_id !== $user->id) {
            abort(403, 'Unauthorized access to this booking.');
        }
        
        $booking->load(['tourPackage', 'agent']);
        
        return Inertia::render('bookings/show', [
            'booking' => $booking
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        // Check authorization
        $user = auth()->user();
        if ($user->isAgent() && $booking->agent_id !== $user->id) {
            abort(403, 'Unauthorized access to this booking.');
        }
        
        $booking->load('tourPackage');
        
        return Inertia::render('bookings/edit', [
            'booking' => $booking
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        $validated = $request->validated();
        
        // If number of people changed, update slots and recalculate amounts
        if ($validated['number_of_people'] !== $booking->number_of_people) {
            $package = $booking->tourPackage;
            $difference = $validated['number_of_people'] - $booking->number_of_people;
            
            if ($difference > 0 && $package->available_slots < $difference) {
                return back()->withErrors([
                    'number_of_people' => 'Not enough available slots for this change.'
                ]);
            }
            
            // Update slots
            $package->decrement('available_slots', $difference);
            
            // Recalculate amounts
            $validated['total_amount'] = $package->price * $validated['number_of_people'];
            $validated['agent_commission'] = $validated['total_amount'] * 0.1;
        }
        
        $booking->update($validated);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        // Check authorization
        $user = auth()->user();
        if ($user->isAgent() && $booking->agent_id !== $user->id) {
            abort(403, 'Unauthorized access to this booking.');
        }
        
        // Restore available slots
        $booking->tourPackage->increment('available_slots', $booking->number_of_people);
        
        $booking->delete();

        return redirect()->route('bookings.index')
            ->with('success', 'Booking deleted successfully.');
    }
}