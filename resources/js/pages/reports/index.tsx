import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/reports' },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface TourPackage {
    id: number;
    name: string;
}

interface Booking {
    id: number;
    customer_name: string;
    total_amount: string;
    agent_commission: string;
    status: string;
    created_at: string;
    tour_package: TourPackage;
}

interface AgentReport {
    agent: User;
    total_bookings: number;
    completed_bookings: number;
    total_sales: number;
    total_commission: number;
    pending_commission: number;
    bookings: Booking[];
}

interface TotalStats {
    total_packages: number;
    active_packages: number;
    total_bookings: number;
    completed_bookings: number;
    total_revenue: number;
    total_commissions_paid: number;
}

interface Props {
    reportData: AgentReport[];
    totalStats: TotalStats;
    filters: {
        status?: string;
        from_date?: string;
        to_date?: string;
    };
    auth: {
        user: {
            role: string;
        };
    };
    [key: string]: unknown;
}

export default function ReportsIndex({ reportData, totalStats, filters, auth }: Props) {
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');

    const formatCurrency = (amount: string | number) => {
        return `$${parseFloat(amount.toString()).toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (filterStatus) params.append('status', filterStatus);
        if (fromDate) params.append('from_date', fromDate);
        if (toDate) params.append('to_date', toDate);
        
        router.get(route('reports.index'), Object.fromEntries(params));
    };

    const clearFilters = () => {
        router.get(route('reports.index'));
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'completed':
                return 'default';
            case 'confirmed':
                return 'secondary';
            case 'pending':
                return 'outline';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Commission Reports - TourManager Pro" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        📊 Commission Reports
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {auth.user.role === 'admin' ? 'View all agent commission reports' : 'View your commission earnings'}
                    </p>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>🔍</span>
                            <span>Filter Reports</span>
                        </CardTitle>
                        <CardDescription>
                            Filter the reports by status and date range
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleFilterSubmit} className="flex items-end space-x-4">
                            <div>
                                <Label htmlFor="status">Booking Status</Label>
                                <select
                                    id="status"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-40 p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="from_date">From Date</Label>
                                <Input
                                    id="from_date"
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-40"
                                />
                            </div>
                            <div>
                                <Label htmlFor="to_date">To Date</Label>
                                <Input
                                    id="to_date"
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-40"
                                />
                            </div>
                            <Button type="submit">Apply Filters</Button>
                            <Button type="button" variant="outline" onClick={clearFilters}>
                                Clear
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Overall Statistics (Admin only) */}
                {auth.user.role === 'admin' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>📈</span>
                                <span>Overall Statistics</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {totalStats.total_packages}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Packages</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {totalStats.active_packages}
                                    </div>
                                    <div className="text-sm text-gray-600">Active Packages</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {totalStats.total_bookings}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Bookings</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {totalStats.completed_bookings}
                                    </div>
                                    <div className="text-sm text-gray-600">Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {formatCurrency(totalStats.total_revenue)}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Revenue</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(totalStats.total_commissions_paid)}
                                    </div>
                                    <div className="text-sm text-gray-600">Commissions Paid</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Agent Reports */}
                <div className="space-y-6">
                    {reportData.map((report) => (
                        <Card key={report.agent.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center space-x-2">
                                            <span>👤</span>
                                            <span>{report.agent.name}</span>
                                        </CardTitle>
                                        <CardDescription>{report.agent.email}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-600">
                                            {formatCurrency(report.total_commission)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Commission Earned</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Agent Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                                    <div className="text-center bg-gray-50 rounded-lg p-3">
                                        <div className="text-xl font-bold text-blue-600">
                                            {report.total_bookings}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Bookings</div>
                                    </div>
                                    <div className="text-center bg-gray-50 rounded-lg p-3">
                                        <div className="text-xl font-bold text-green-600">
                                            {report.completed_bookings}
                                        </div>
                                        <div className="text-sm text-gray-600">Completed</div>
                                    </div>
                                    <div className="text-center bg-gray-50 rounded-lg p-3">
                                        <div className="text-xl font-bold text-purple-600">
                                            {formatCurrency(report.total_sales)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Sales</div>
                                    </div>
                                    <div className="text-center bg-gray-50 rounded-lg p-3">
                                        <div className="text-xl font-bold text-green-600">
                                            {formatCurrency(report.total_commission)}
                                        </div>
                                        <div className="text-sm text-gray-600">Earned Commission</div>
                                    </div>
                                    <div className="text-center bg-gray-50 rounded-lg p-3">
                                        <div className="text-xl font-bold text-orange-600">
                                            {formatCurrency(report.pending_commission)}
                                        </div>
                                        <div className="text-sm text-gray-600">Pending Commission</div>
                                    </div>
                                </div>

                                {/* Recent Bookings */}
                                {report.bookings.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                                            <span>📋</span>
                                            <span>Recent Bookings (Latest {report.bookings.length})</span>
                                        </h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left p-2">Customer</th>
                                                        <th className="text-left p-2">Tour Package</th>
                                                        <th className="text-left p-2">Amount</th>
                                                        <th className="text-left p-2">Commission</th>
                                                        <th className="text-left p-2">Status</th>
                                                        <th className="text-left p-2">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {report.bookings.map((booking) => (
                                                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                                                            <td className="p-2 font-medium">
                                                                {booking.customer_name}
                                                            </td>
                                                            <td className="p-2">
                                                                {booking.tour_package.name}
                                                            </td>
                                                            <td className="p-2 font-medium text-green-600">
                                                                {formatCurrency(booking.total_amount)}
                                                            </td>
                                                            <td className="p-2 font-medium text-blue-600">
                                                                {formatCurrency(booking.agent_commission)}
                                                            </td>
                                                            <td className="p-2">
                                                                <Badge variant={getStatusBadgeVariant(booking.status)}>
                                                                    {booking.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="p-2 text-gray-600">
                                                                {formatDate(booking.created_at)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {reportData.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No report data found</h3>
                        <p className="text-gray-600 mb-6">
                            {auth.user.role === 'admin' 
                                ? 'No agents have made bookings yet or match the current filters.'
                                : 'You haven\'t made any bookings yet or match the current filters.'}
                        </p>
                        {filters.status || filters.from_date || filters.to_date ? (
                            <Button onClick={clearFilters}>Clear Filters</Button>
                        ) : null}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}