<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\TourPackage;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display agent commission reports.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Admin can see all agent reports, agents only see their own
        $agentsQuery = User::where('role', 'agent');
        
        if ($user->isAgent()) {
            $agentsQuery->where('id', $user->id);
        }
        
        $agents = $agentsQuery->with(['bookings' => function ($query) use ($request) {
            $query->with('tourPackage');
            
            // Filter by status if provided
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }
            
            // Filter by date range if provided
            if ($request->filled('from_date')) {
                $query->whereDate('created_at', '>=', $request->from_date);
            }
            
            if ($request->filled('to_date')) {
                $query->whereDate('created_at', '<=', $request->to_date);
            }
        }])->get();
        
        // Calculate totals for each agent
        $reportData = $agents->map(function ($agent) {
            $bookings = $agent->bookings;
            
            return [
                'agent' => $agent,
                'total_bookings' => $bookings->count(),
                'completed_bookings' => $bookings->where('status', 'completed')->count(),
                'total_sales' => $bookings->sum('total_amount'),
                'total_commission' => $bookings->where('status', 'completed')->sum('agent_commission'),
                'pending_commission' => $bookings->whereIn('status', ['pending', 'confirmed'])->sum('agent_commission'),
                'bookings' => $bookings->take(5), // Show latest 5 bookings
            ];
        });
        
        // Overall statistics
        $totalStats = [
            'total_packages' => TourPackage::count(),
            'active_packages' => TourPackage::where('status', 'active')->count(),
            'total_bookings' => Booking::count(),
            'completed_bookings' => Booking::where('status', 'completed')->count(),
            'total_revenue' => Booking::where('status', 'completed')->sum('total_amount'),
            'total_commissions_paid' => Booking::where('status', 'completed')->sum('agent_commission'),
        ];
        
        return Inertia::render('reports/index', [
            'reportData' => $reportData,
            'totalStats' => $totalStats,
            'filters' => $request->only(['status', 'from_date', 'to_date']),
        ]);
    }
}