import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
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
}

interface Booking {
    id: number;
    customer_name: string;
    number_of_people: number;
    total_amount: string;
    agent_commission: string;
    status: string;
    created_at: string;
    tour_package: TourPackage;
    agent?: {
        name: string;
    };
}

interface Props {
    featuredPackages: TourPackage[];
    userStats: {
        total_packages?: number;
        active_packages?: number;
        total_bookings?: number;
        total_agents?: number;
        my_bookings?: number;
        completed_bookings?: number;
        pending_bookings?: number;
        total_commission?: number;
        recent_bookings?: Booking[];
    };
    userRole: string;
    [key: string]: unknown;
}

export default function Dashboard({ featuredPackages, userStats, userRole }: Props) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - TourManager Pro" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Welcome Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            🌍 Welcome to TourManager Pro
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {userRole === 'admin' ? 'Manage your tour packages and monitor business performance' : 'Track your bookings and commission earnings'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
                            {userRole === 'admin' ? '👑 Admin' : '👤 Agent'}
                        </Badge>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {userRole === 'admin' ? (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
                                    <div className="text-2xl">📦</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{userStats.total_packages || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {userStats.active_packages || 0} active packages
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                                    <div className="text-2xl">📋</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{userStats.total_bookings || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        All-time bookings
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                                    <div className="text-2xl">👥</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{userStats.total_agents || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Registered agents
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                                    <div className="text-2xl">⚡</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Link href={route('tour-packages.create')}>
                                            <Button size="sm" className="w-full">Create Package</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
                                    <div className="text-2xl">📋</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{userStats.my_bookings || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Total bookings made
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                    <div className="text-2xl">✅</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{userStats.completed_bookings || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Successfully completed
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                                    <div className="text-2xl">💰</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(userStats.total_commission || 0)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Earned from completed bookings
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                                    <div className="text-2xl">⚡</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Link href={route('bookings.create')}>
                                            <Button size="sm" className="w-full">New Booking</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Featured Packages */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center space-x-2">
                                        <span>🌟</span>
                                        <span>Featured Packages</span>
                                    </CardTitle>
                                    <CardDescription>Available tour packages with open slots</CardDescription>
                                </div>
                                <Link href={route('tour-packages.index')}>
                                    <Button variant="outline" size="sm">View All</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {featuredPackages?.slice(0, 4).map((pkg) => (
                                    <div key={pkg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{pkg.name}</h4>
                                            <p className="text-sm text-gray-600">
                                                {pkg.destinations.join(' → ')}
                                            </p>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {formatDate(pkg.start_date)} - {formatDate(pkg.end_date)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-green-600">{formatCurrency(pkg.price)}</div>
                                            <div className="text-xs text-gray-500">
                                                {pkg.available_slots}/{pkg.max_capacity} slots
                                            </div>
                                        </div>
                                    </div>
                                )) || (
                                    <div className="text-center text-gray-500 py-8">
                                        <div className="text-4xl mb-2">📦</div>
                                        <p>No packages available</p>
                                        {userRole === 'admin' && (
                                            <Link href={route('tour-packages.create')} className="mt-2">
                                                <Button size="sm">Create First Package</Button>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center space-x-2">
                                        <span>📊</span>
                                        <span>Recent Activity</span>
                                    </CardTitle>
                                    <CardDescription>Latest booking activities</CardDescription>
                                </div>
                                <Link href={route('bookings.index')}>
                                    <Button variant="outline" size="sm">View All</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {userStats.recent_bookings?.slice(0, 5).map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{booking.customer_name}</h4>
                                            <p className="text-sm text-gray-600">
                                                {booking.tour_package.name}
                                            </p>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {formatDate(booking.created_at)}
                                                {userRole === 'admin' && booking.agent && (
                                                    <span> • Agent: {booking.agent.name}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={getStatusBadgeVariant(booking.status)}>
                                                {booking.status}
                                            </Badge>
                                            <div className="text-sm font-medium mt-1">
                                                {formatCurrency(booking.total_amount)}
                                            </div>
                                        </div>
                                    </div>
                                )) || (
                                    <div className="text-center text-gray-500 py-8">
                                        <div className="text-4xl mb-2">📋</div>
                                        <p>No recent bookings</p>
                                        {userRole === 'agent' && (
                                            <Link href={route('bookings.create')} className="mt-2">
                                                <Button size="sm">Create First Booking</Button>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Navigation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>🚀</span>
                            <span>Quick Navigation</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {userRole === 'admin' ? (
                                <>
                                    <Link href={route('tour-packages.index')}>
                                        <Button variant="outline" className="w-full h-16 flex flex-col space-y-1">
                                            <span className="text-xl">📦</span>
                                            <span>Packages</span>
                                        </Button>
                                    </Link>
                                    <Link href={route('bookings.index')}>
                                        <Button variant="outline" className="w-full h-16 flex flex-col space-y-1">
                                            <span className="text-xl">📋</span>
                                            <span>All Bookings</span>
                                        </Button>
                                    </Link>
                                    <Link href={route('reports.index')}>
                                        <Button variant="outline" className="w-full h-16 flex flex-col space-y-1">
                                            <span className="text-xl">📊</span>
                                            <span>Reports</span>
                                        </Button>
                                    </Link>
                                    <Link href={route('tour-packages.create')}>
                                        <Button className="w-full h-16 flex flex-col space-y-1">
                                            <span className="text-xl">➕</span>
                                            <span>New Package</span>
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('tour-packages.index')}>
                                        <Button variant="outline" className="w-full h-16 flex flex-col space-y-1">
                                            <span className="text-xl">🌍</span>
                                            <span>Browse Tours</span>
                                        </Button>
                                    </Link>
                                    <Link href={route('bookings.index')}>
                                        <Button variant="outline" className="w-full h-16 flex flex-col space-y-1">
                                            <span className="text-xl">📋</span>
                                            <span>My Bookings</span>
                                        </Button>
                                    </Link>
                                    <Link href={route('reports.index')}>
                                        <Button variant="outline" className="w-full h-16 flex flex-col space-y-1">
                                            <span className="text-xl">💰</span>
                                            <span>My Earnings</span>
                                        </Button>
                                    </Link>
                                    <Link href={route('bookings.create')}>
                                        <Button className="w-full h-16 flex flex-col space-y-1">
                                            <span className="text-xl">➕</span>
                                            <span>New Booking</span>
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}