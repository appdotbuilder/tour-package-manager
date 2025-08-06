import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    const features = [
        {
            icon: '🌍',
            title: 'Tour Package Management',
            description: 'Create, edit, and manage comprehensive tour packages with destinations, dates, pricing, and facilities.',
        },
        {
            icon: '📋',
            title: 'Booking Management',
            description: 'Handle customer registrations, track bookings, and manage reservation status efficiently.',
        },
        {
            icon: '👥',
            title: 'Multi-Role System',
            description: 'Admin and Agent roles with appropriate permissions for package creation and booking management.',
        },
        {
            icon: '💰',
            title: 'Commission Reports',
            description: 'Generate detailed agent commission reports for completed bookings with filtering options.',
        },
        {
            icon: '📊',
            title: 'Analytics Dashboard',
            description: 'Track package performance, booking statistics, and revenue insights in real-time.',
        },
        {
            icon: '🔒',
            title: 'Secure & Scalable',
            description: 'Built with Laravel and React, featuring role-based access control and data validation.',
        },
    ];

    const samplePackages = [
        {
            name: 'Bali Paradise Explorer',
            destinations: ['Ubud', 'Seminyak', 'Nusa Penida'],
            price: 899,
            duration: '7 days',
            image: '🏝️',
        },
        {
            name: 'Tokyo Cultural Journey',
            destinations: ['Shibuya', 'Kyoto', 'Mount Fuji'],
            price: 1299,
            duration: '10 days',
            image: '🏯',
        },
        {
            name: 'European Grand Tour',
            destinations: ['Paris', 'Rome', 'Barcelona'],
            price: 1899,
            duration: '14 days',
            image: '🏰',
        },
    ];

    return (
        <>
            <Head title="Tour Package Management System" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-3xl">🌍</div>
                                <h1 className="text-2xl font-bold text-gray-900">TourManager Pro</h1>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-700">Welcome, {auth.user.name}</span>
                                        <Badge variant={auth.user.role === 'admin' ? 'default' : 'secondary'}>
                                            {auth.user.role === 'admin' ? '👑 Admin' : '👤 Agent'}
                                        </Badge>
                                        <Link href={route('dashboard')}>
                                            <Button>Go to Dashboard</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link href={route('login')}>
                                            <Button variant="outline">Login</Button>
                                        </Link>
                                        <Link href={route('register')}>
                                            <Button>Get Started</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-16">
                        <div className="text-6xl mb-6">✈️🌟</div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Complete Tour Package Management
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Streamline your travel business with our comprehensive platform for managing 
                            tour packages, bookings, agents, and commission reports all in one place.
                        </p>
                        
                        {!auth?.user && (
                            <div className="flex justify-center space-x-4">
                                <Link href={route('register')}>
                                    <Button size="lg" className="text-lg px-8 py-3">
                                        🚀 Start Free Trial
                                    </Button>
                                </Link>
                                <Link href={route('login')}>
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                                        👤 Login
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sample Tour Packages */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                            📸 Sample Tour Packages
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {samplePackages.map((pkg, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="text-center">
                                        <div className="text-4xl mb-2">{pkg.image}</div>
                                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                                        <CardDescription>
                                            {pkg.destinations.join(' → ')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <div className="text-2xl font-bold text-green-600 mb-2">
                                            ${pkg.price}
                                        </div>
                                        <div className="text-gray-600">{pkg.duration}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                            🎯 Powerful Features
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="text-4xl mb-2">{feature.icon}</div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-gray-600">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    {!auth?.user && (
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">
                                Ready to Transform Your Travel Business? 🚀
                            </h2>
                            <p className="text-xl mb-6 opacity-90">
                                Join hundreds of travel agencies already using TourManager Pro
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Link href={route('register')}>
                                    <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                                        🎉 Create Free Account
                                    </Button>
                                </Link>
                                <Link href={route('login')}>
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                                        👋 Sign In
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="text-2xl">🌍</div>
                            <span className="text-xl font-semibold">TourManager Pro</span>
                        </div>
                        <p className="text-gray-400">
                            Complete tour package management solution for modern travel businesses
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}