import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tour Packages', href: '/tour-packages' },
];

interface TourPackage {
    id: number;
    name: string;
    description: string;
    destinations: string[];
    start_date: string;
    end_date: string;
    price: string;
    available_slots: number;
    max_capacity: number;
    status: string;
    facilities: string[];
    bookings_count: number;
    created_at: string;
}

interface Props {
    packages: {
        data: TourPackage[];
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

export default function TourPackagesIndex({ packages, auth }: Props) {
    const formatCurrency = (amount: string | number) => {
        return `$${parseFloat(amount.toString()).toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
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

    const handleDelete = (packageId: number) => {
        if (confirm('Are you sure you want to delete this tour package?')) {
            router.delete(route('tour-packages.destroy', packageId));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tour Packages - TourManager Pro" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            🌍 Tour Packages
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {auth.user.role === 'admin' ? 'Manage your tour packages' : 'Browse available tour packages'}
                        </p>
                    </div>
                    {auth.user.role === 'admin' && (
                        <Link href={route('tour-packages.create')}>
                            <Button className="flex items-center space-x-2">
                                <span>➕</span>
                                <span>Create Package</span>
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">📦</div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Packages</p>
                                    <p className="text-2xl font-bold">{packages.meta.total || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">✅</div>
                                <div>
                                    <p className="text-sm text-gray-600">Active</p>
                                    <p className="text-2xl font-bold">
                                        {packages.data.filter(pkg => pkg.status === 'active').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">📋</div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Bookings</p>
                                    <p className="text-2xl font-bold">
                                        {packages.data.reduce((sum, pkg) => sum + pkg.bookings_count, 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">🎯</div>
                                <div>
                                    <p className="text-sm text-gray-600">Available Slots</p>
                                    <p className="text-2xl font-bold">
                                        {packages.data.reduce((sum, pkg) => sum + pkg.available_slots, 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Packages Grid */}
                {packages.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.data.map((pkg) => (
                            <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-2">{pkg.name}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {pkg.description}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={getStatusBadgeVariant(pkg.status)}>
                                            {pkg.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    {/* Destinations */}
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-700 mb-2">🗺️ Destinations</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {pkg.destinations.map((dest, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {dest}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-700 mb-1">📅 Duration</h4>
                                        <p className="text-sm text-gray-600">
                                            {formatDate(pkg.start_date)} - {formatDate(pkg.end_date)}
                                        </p>
                                    </div>

                                    {/* Price and Capacity */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-2xl font-bold text-green-600">
                                                {formatCurrency(pkg.price)}
                                            </p>
                                            <p className="text-xs text-gray-500">per person</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                {pkg.available_slots}/{pkg.max_capacity}
                                            </p>
                                            <p className="text-xs text-gray-500">slots available</p>
                                        </div>
                                    </div>

                                    {/* Facilities */}
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-700 mb-2">🏨 Facilities</h4>
                                        <div className="grid grid-cols-2 gap-1">
                                            {pkg.facilities.slice(0, 4).map((facility, index) => (
                                                <div key={index} className="text-xs text-gray-600 truncate">
                                                    • {facility}
                                                </div>
                                            ))}
                                            {pkg.facilities.length > 4 && (
                                                <div className="text-xs text-gray-500 col-span-2">
                                                    +{pkg.facilities.length - 4} more
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bookings Info */}
                                    <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                                        <span>📋 {pkg.bookings_count} bookings</span>
                                        <span>Created {formatDate(pkg.created_at)}</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 pt-2">
                                        <Link href={route('tour-packages.show', pkg.id)} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                View Details
                                            </Button>
                                        </Link>
                                        
                                        {auth.user.role === 'admin' && (
                                            <>
                                                <Link href={route('tour-packages.edit', pkg.id)}>
                                                    <Button variant="outline" size="sm">
                                                        ✏️
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(pkg.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    🗑️
                                                </Button>
                                            </>
                                        )}
                                        
                                        {auth.user.role === 'agent' && pkg.status === 'active' && pkg.available_slots > 0 && (
                                            <Link href={route('bookings.create', { package: pkg.id })}>
                                                <Button size="sm">
                                                    Book Now
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🌍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tour packages found</h3>
                        <p className="text-gray-600 mb-6">
                            {auth.user.role === 'admin' 
                                ? 'Create your first tour package to get started.'
                                : 'Check back later for new tour packages.'}
                        </p>
                        {auth.user.role === 'admin' && (
                            <Link href={route('tour-packages.create')}>
                                <Button>Create First Package</Button>
                            </Link>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {packages.links && packages.links.length > 3 && (
                    <div className="flex justify-center mt-6">
                        <nav className="flex items-center space-x-2">
                            {packages.links.map((link, index) => (
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