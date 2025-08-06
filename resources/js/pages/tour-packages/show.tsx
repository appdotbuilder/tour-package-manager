import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

interface TourPackage {
    id: number;
    name: string;
    description: string;
    destinations: string[];
    start_date: string;
    end_date: string;
    price: string;
    max_capacity: number;
    available_slots: number;
    facilities: string[];
    status: string;
    created_at: string;
    bookings: Array<{
        id: number;
        customer_name: string;
        number_of_people: number;
        status: string;
        created_at: string;
        agent: {
            name: string;
        };
    }>;
}

interface Props {
    package: TourPackage;
    auth: {
        user: {
            role: string;
        };
    };
    [key: string]: unknown;
}

export default function ShowTourPackage({ package: pkg, auth }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tour Packages', href: '/tour-packages' },
        { title: pkg.name, href: route('tour-packages.show', pkg.id) },
    ];

    const formatCurrency = (amount: string | number) => {
        return `$${parseFloat(amount.toString()).toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'inactive':
                return 'secondary';
            case 'completed':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getBookingStatusBadgeVariant = (status: string) => {
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

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this tour package? This action cannot be undone.')) {
            router.delete(route('tour-packages.destroy', pkg.id));
        }
    };

    const totalBookedSlots = pkg.max_capacity - pkg.available_slots;
    const occupancyRate = (totalBookedSlots / pkg.max_capacity) * 100;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${pkg.name} - TourManager Pro`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">{pkg.name}</h1>
                            <Badge variant={getStatusBadgeVariant(pkg.status)} className="text-sm">
                                {pkg.status}
                            </Badge>
                        </div>
                        <p className="text-gray-600 text-lg">{pkg.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        {auth.user.role === 'admin' && (
                            <>
                                <Link href={route('tour-packages.edit', pkg.id)}>
                                    <Button variant="outline" className="flex items-center space-x-2">
                                        <span>✏️</span>
                                        <span>Edit</span>
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={handleDelete}
                                    className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                                >
                                    <span>🗑️</span>
                                    <span>Delete</span>
                                </Button>
                            </>
                        )}
                        {auth.user.role === 'agent' && pkg.status === 'active' && pkg.available_slots > 0 && (
                            <Link href={route('bookings.create', { package: pkg.id })}>
                                <Button className="flex items-center space-x-2">
                                    <span>📋</span>
                                    <span>Book Now</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Package Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tour Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <span>📅</span>
                                    <span>Tour Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Start Date</h4>
                                        <p className="text-lg">{formatDate(pkg.start_date)}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">End Date</h4>
                                        <p className="text-lg">{formatDate(pkg.end_date)}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Duration</h4>
                                        <p className="text-lg">
                                            {Math.ceil((new Date(pkg.end_date).getTime() - new Date(pkg.start_date).getTime()) / (1000 * 3600 * 24))} days
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Price per Person</h4>
                                        <p className="text-2xl font-bold text-green-600">{formatCurrency(pkg.price)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Destinations */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <span>🗺️</span>
                                    <span>Destinations</span>
                                </CardTitle>
                                <CardDescription>Places you'll visit on this tour</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {pkg.destinations.map((destination, index) => (
                                        <div key={index} className="bg-blue-50 rounded-lg p-3 text-center">
                                            <div className="text-2xl mb-1">📍</div>
                                            <div className="font-medium text-blue-900">{destination}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Facilities */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <span>🏨</span>
                                    <span>Facilities & Services</span>
                                </CardTitle>
                                <CardDescription>What's included in this package</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {pkg.facilities.map((facility, index) => (
                                        <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                                            <div className="text-green-500">✅</div>
                                            <span className="font-medium">{facility}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bookings List */}
                        {pkg.bookings.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <span>📋</span>
                                        <span>Bookings ({pkg.bookings.length})</span>
                                    </CardTitle>
                                    <CardDescription>Customer bookings for this package</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left p-2">Customer</th>
                                                    <th className="text-left p-2">People</th>
                                                    <th className="text-left p-2">Status</th>
                                                    {auth.user.role === 'admin' && (
                                                        <th className="text-left p-2">Agent</th>
                                                    )}
                                                    <th className="text-left p-2">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pkg.bookings.map((booking) => (
                                                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                                                        <td className="p-2 font-medium">{booking.customer_name}</td>
                                                        <td className="p-2">{booking.number_of_people}</td>
                                                        <td className="p-2">
                                                            <Badge variant={getBookingStatusBadgeVariant(booking.status)}>
                                                                {booking.status}
                                                            </Badge>
                                                        </td>
                                                        {auth.user.role === 'admin' && (
                                                            <td className="p-2">{booking.agent.name}</td>
                                                        )}
                                                        <td className="p-2 text-sm text-gray-600">
                                                            {formatDate(booking.created_at)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Capacity Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <span>👥</span>
                                    <span>Capacity</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Maximum Capacity:</span>
                                        <span className="font-bold">{pkg.max_capacity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Available Slots:</span>
                                        <span className="font-bold text-green-600">{pkg.available_slots}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Booked Slots:</span>
                                        <span className="font-bold text-blue-600">{totalBookedSlots}</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Occupancy Rate:</span>
                                        <span className="font-medium">{occupancyRate.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${occupancyRate}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                {pkg.available_slots === 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-red-500">🚫</span>
                                            <span className="text-red-700 font-medium">Fully Booked</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Package Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <span>📊</span>
                                    <span>Statistics</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="bg-green-50 rounded-lg p-3">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {formatCurrency(parseFloat(pkg.price) * totalBookedSlots)}
                                            </div>
                                            <div className="text-sm text-green-700">Total Revenue</div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {pkg.bookings.length}
                                            </div>
                                            <div className="text-sm text-blue-700">Total Bookings</div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-purple-50 rounded-lg p-3">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {pkg.bookings.filter(b => b.status === 'completed').length}
                                            </div>
                                            <div className="text-sm text-purple-700">Completed</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-3 border-t text-sm text-gray-600">
                                    <p>Created: {formatDate(pkg.created_at)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <span>⚡</span>
                                    <span>Quick Actions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {auth.user.role === 'agent' && pkg.status === 'active' && pkg.available_slots > 0 && (
                                    <Link href={route('bookings.create', { package: pkg.id })}>
                                        <Button className="w-full flex items-center justify-center space-x-2">
                                            <span>📋</span>
                                            <span>Create Booking</span>
                                        </Button>
                                    </Link>
                                )}
                                
                                <Link href={route('tour-packages.index')}>
                                    <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                                        <span>🔙</span>
                                        <span>Back to Packages</span>
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}