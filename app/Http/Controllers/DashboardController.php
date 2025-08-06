<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\TourPackage;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the main dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get featured tour packages
        $featuredPackages = TourPackage::active()
            ->where('available_slots', '>', 0)
            ->latest()
            ->take(6)
            ->get();
        
        // Get user-specific stats
        $userStats = [];
        
        if ($user->isAdmin()) {
            $userStats = [
                'total_packages' => TourPackage::count(),
                'active_packages' => TourPackage::where('status', 'active')->count(),
                'total_bookings' => Booking::count(),
                'total_agents' => User::where('role', 'agent')->count(),
                'recent_bookings' => Booking::with(['tourPackage', 'agent'])
                    ->latest()
                    ->take(5)
                    ->get(),
            ];
        } elseif ($user->isAgent()) {
            $userStats = [
                'my_bookings' => Booking::where('agent_id', $user->id)->count(),
                'completed_bookings' => Booking::where('agent_id', $user->id)
                    ->where('status', 'completed')
                    ->count(),
                'pending_bookings' => Booking::where('agent_id', $user->id)
                    ->where('status', 'pending')
                    ->count(),
                'total_commission' => Booking::where('agent_id', $user->id)
                    ->where('status', 'completed')
                    ->sum('agent_commission'),
                'recent_bookings' => Booking::with('tourPackage')
                    ->where('agent_id', $user->id)
                    ->latest()
                    ->take(5)
                    ->get(),
            ];
        }
        
        return Inertia::render('dashboard', [
            'featuredPackages' => $featuredPackages,
            'userStats' => $userStats,
            'userRole' => $user->role,
        ]);
    }
}