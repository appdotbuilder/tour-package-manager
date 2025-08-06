import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
];

interface TourPackage {
    id: number;
    name: string;
    price: string;
}

interface Agent {
    id: number;
    name: string;
}

interface Booking {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    number_of_people: number;
    total_amount: string;
    agent_commission: string;
    status: string;
    notes: string | null;
    created_at: string;
    tour_package: TourPackage;
    agent?: Agent;
}

interface Props {
    bookings: {
        data: Booking[];
        links: { url?: string; label: string; active: boolean }[];
        meta: { total: number };
    };
    auth: {
        user: {
            role: string;
        };
    };
    [key: string]: unknown;
}

export default function BookingsIndex({ bookings, auth }: Props) {
    const formatCurrency = (amount: string | number) => {
        return `$${parseFloat(amount.toString()).toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
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

    const handleDelete = (bookingId: number) => {
        if (confirm('Are you sure you want to delete this booking?')) {
            router.delete(route('bookings.destroy', bookingId));
        }
    };


    const totalRevenue = bookings.data.reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0);
    const totalCommission = bookings.data.reduce((sum, booking) => sum + parseFloat(booking.agent_commission), 0);
    const completedBookings = bookings.data.filter(booking => booking.status === 'completed').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings - TourManager Pro" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            📋 Bookings
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {auth.user.role === 'admin' ? 'Manage all booking records' : 'Manage your booking records'}
                        </p>
                    </div>
                    <Link href={route('bookings.create')}>
                        <Button className="flex items-center space-x-2">
                            <span>➕</span>
                            <span>New Booking</span>
                        </Button>
                    </Link>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">📋</div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Bookings</p>
                                    <p className="text-2xl font-bold">{bookings.meta.total || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">✅</div>
                                <div>
                                    <p className="text-sm text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold">{completedBookings}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">💰</div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">💎</div>
                                <div>
                                    <p className="text-sm text-gray-600">Commission</p>
                                    <p className="text-2xl font-bold">{formatCurrency(totalCommission)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bookings Table */}
                {bookings.data.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>All Bookings</CardTitle>
                            <CardDescription>
                                Manage and track booking records
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Customer</th>
                                            <th className="text-left p-2">Tour Package</th>
                                            <th className="text-left p-2">People</th>
                                            <th className="text-left p-2">Amount</th>
                                            <th className="text-left p-2">Commission</th>
                                            <th className="text-left p-2">Status</th>
                                            {auth.user.role === 'admin' && (
                                                <th className="text-left p-2">Agent</th>
                                            )}
                                            <th className="text-left p-2">Date</th>
                                            <th className="text-left p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.data.map((booking) => (
                                            <tr key={booking.id} className="border-b hover:bg-gray-50">
                                                <td className="p-2">
                                                    <div>
                                                        <div className="font-medium">{booking.customer_name}</div>
                                                        <div className="text-sm text-gray-600">{booking.customer_email}</div>
                                                        <div className="text-sm text-gray-600">{booking.customer_phone}</div>
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    <div className="font-medium">{booking.tour_package.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {formatCurrency(booking.tour_package.price)} per person
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    <span className="font-medium">{booking.number_of_people}</span>
                                                </td>
                                                <td className="p-2">
                                                    <span className="font-bold text-green-600">
                                                        {formatCurrency(booking.total_amount)}
                                                    </span>
                                                </td>
                                                <td className="p-2">
                                                    <span className="font-medium text-blue-600">
                                                        {formatCurrency(booking.agent_commission)}
                                                    </span>
                                                </td>
                                                <td className="p-2">
                                                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                                                        {booking.status}
                                                    </Badge>
                                                </td>
                                                {auth.user.role === 'admin' && (
                                                    <td className="p-2">
                                                        {booking.agent?.name || 'N/A'}
                                                    </td>
                                                )}
                                                <td className="p-2 text-sm text-gray-600">
                                                    {formatDate(booking.created_at)}
                                                </td>
                                                <td className="p-2">
                                                    <div className="flex space-x-2">
                                                        <Link href={route('bookings.show', booking.id)}>
                                                            <Button variant="outline" size="sm">
                                                                👁️
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('bookings.edit', booking.id)}>
                                                            <Button variant="outline" size="sm">
                                                                ✏️
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(booking.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            🗑️
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                        <p className="text-gray-600 mb-6">
                            Create your first booking to get started.
                        </p>
                        <Link href={route('bookings.create')}>
                            <Button>Create First Booking</Button>
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {bookings.links && bookings.links.length > 3 && (
                    <div className="flex justify-center mt-6">
                        <nav className="flex items-center space-x-2">
                            {bookings.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 text-sm rounded ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}