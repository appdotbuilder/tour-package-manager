import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
    { title: 'Create Booking', href: '/bookings/create' },
];

interface TourPackage {
    id: number;
    name: string;
    price: string;
    available_slots: number;
}

interface BookingFormData {
    tour_package_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    number_of_people: string;
    notes: string;
    [key: string]: string;
}

interface Props {
    packages: TourPackage[];
    [key: string]: unknown;
}

export default function CreateBooking({ packages }: Props) {
    const { data, setData, post, processing, errors } = useForm<BookingFormData>({
        tour_package_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        number_of_people: '1',
        notes: '',
    });

    const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [commission, setCommission] = useState(0);

    useEffect(() => {
        const pkg = packages.find(p => p.id.toString() === data.tour_package_id);
        setSelectedPackage(pkg || null);
        
        if (pkg && data.number_of_people) {
            const people = parseInt(data.number_of_people);
            const total = parseFloat(pkg.price) * people;
            setTotalAmount(total);
            setCommission(total * 0.1); // 10% commission
        } else {
            setTotalAmount(0);
            setCommission(0);
        }
    }, [data.tour_package_id, data.number_of_people, packages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bookings.store'));
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString()}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Booking - TourManager Pro" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        ➕ Create Booking
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Create a new booking for your customers
                    </p>
                </div>

                {/* Form */}
                <div className="max-w-4xl">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Tour Package Selection */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <span>🌍</span>
                                            <span>Select Tour Package</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Choose the tour package for this booking
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="tour_package_id">Tour Package</Label>
                                            <select
                                                id="tour_package_id"
                                                value={data.tour_package_id}
                                                onChange={(e) => setData('tour_package_id', e.target.value)}
                                                className={`w-full p-2 border rounded-md ${errors.tour_package_id ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">Select a tour package...</option>
                                                {packages.map((pkg) => (
                                                    <option key={pkg.id} value={pkg.id.toString()}>
                                                        {pkg.name} - {formatCurrency(parseFloat(pkg.price))} ({pkg.available_slots} slots available)
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.tour_package_id && (
                                                <p className="text-red-500 text-sm mt-1">{errors.tour_package_id}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="number_of_people">Number of People</Label>
                                            <Input
                                                id="number_of_people"
                                                type="number"
                                                min="1"
                                                max={selectedPackage?.available_slots || 1}
                                                value={data.number_of_people}
                                                onChange={(e) => setData('number_of_people', e.target.value)}
                                                className={errors.number_of_people ? 'border-red-500' : ''}
                                            />
                                            {errors.number_of_people && (
                                                <p className="text-red-500 text-sm mt-1">{errors.number_of_people}</p>
                                            )}
                                            {selectedPackage && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Available slots: {selectedPackage.available_slots}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Customer Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <span>👤</span>
                                            <span>Customer Information</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Enter the customer's contact details
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="customer_name">Customer Name</Label>
                                            <Input
                                                id="customer_name"
                                                type="text"
                                                value={data.customer_name}
                                                onChange={(e) => setData('customer_name', e.target.value)}
                                                placeholder="e.g., John Doe"
                                                className={errors.customer_name ? 'border-red-500' : ''}
                                            />
                                            {errors.customer_name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="customer_email">Email Address</Label>
                                            <Input
                                                id="customer_email"
                                                type="email"
                                                value={data.customer_email}
                                                onChange={(e) => setData('customer_email', e.target.value)}
                                                placeholder="e.g., john.doe@example.com"
                                                className={errors.customer_email ? 'border-red-500' : ''}
                                            />
                                            {errors.customer_email && (
                                                <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="customer_phone">Phone Number</Label>
                                            <Input
                                                id="customer_phone"
                                                type="tel"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                placeholder="e.g., +1 (555) 123-4567"
                                                className={errors.customer_phone ? 'border-red-500' : ''}
                                            />
                                            {errors.customer_phone && (
                                                <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="notes">Notes (Optional)</Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="Any special requirements or notes..."
                                                rows={3}
                                                className={errors.notes ? 'border-red-500' : ''}
                                            />
                                            {errors.notes && (
                                                <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Booking Summary */}
                            <div>
                                <Card className="sticky top-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <span>📊</span>
                                            <span>Booking Summary</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {selectedPackage ? (
                                            <>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">
                                                        {selectedPackage.name}
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>Price per person:</span>
                                                            <span>{formatCurrency(parseFloat(selectedPackage.price))}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Number of people:</span>
                                                            <span>{data.number_of_people}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Available slots:</span>
                                                            <span>{selectedPackage.available_slots}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t pt-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between font-medium">
                                                            <span>Total Amount:</span>
                                                            <span className="text-green-600">
                                                                {formatCurrency(totalAmount)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm text-gray-600">
                                                            <span>Your Commission (10%):</span>
                                                            <span className="text-blue-600">
                                                                {formatCurrency(commission)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t">
                                                    <div className="bg-blue-50 p-3 rounded-lg">
                                                        <h5 className="font-medium text-blue-900 mb-1">💡 Commission Info</h5>
                                                        <p className="text-sm text-blue-700">
                                                            You'll earn {formatCurrency(commission)} when this booking is completed.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <div className="text-4xl mb-2">📦</div>
                                                <p>Select a tour package to see booking summary</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !selectedPackage}
                                className="flex items-center space-x-2"
                            >
                                {processing ? (
                                    <>
                                        <span>⏳</span>
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>✅</span>
                                        <span>Create Booking</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}