import React, { useState } from 'react';
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
    { title: 'Tour Packages', href: '/tour-packages' },
    { title: 'Create Package', href: '/tour-packages/create' },
];

interface PackageFormData {
    name: string;
    description: string;
    destinations: string[];
    start_date: string;
    end_date: string;
    price: string;
    max_capacity: string;
    facilities: string[];
    [key: string]: string | string[];
}



export default function CreateTourPackage() {
    const { data, setData, post, processing, errors } = useForm<PackageFormData>({
        name: '',
        description: '',
        destinations: [''],
        start_date: '',
        end_date: '',
        price: '',
        max_capacity: '',
        facilities: [''],
    });

    const [destinationInputs, setDestinationInputs] = useState(['']);
    const [facilityInputs, setFacilityInputs] = useState(['']);

    const handleDestinationChange = (index: number, value: string) => {
        const newDestinations = [...destinationInputs];
        newDestinations[index] = value;
        setDestinationInputs(newDestinations);
        setData('destinations', newDestinations.filter(dest => dest.trim() !== ''));
    };

    const addDestination = () => {
        setDestinationInputs([...destinationInputs, '']);
    };

    const removeDestination = (index: number) => {
        const newDestinations = destinationInputs.filter((_, i) => i !== index);
        setDestinationInputs(newDestinations);
        setData('destinations', newDestinations.filter(dest => dest.trim() !== ''));
    };

    const handleFacilityChange = (index: number, value: string) => {
        const newFacilities = [...facilityInputs];
        newFacilities[index] = value;
        setFacilityInputs(newFacilities);
        setData('facilities', newFacilities.filter(facility => facility.trim() !== ''));
    };

    const addFacility = () => {
        setFacilityInputs([...facilityInputs, '']);
    };

    const removeFacility = (index: number) => {
        const newFacilities = facilityInputs.filter((_, i) => i !== index);
        setFacilityInputs(newFacilities);
        setData('facilities', newFacilities.filter(facility => facility.trim() !== ''));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tour-packages.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Tour Package - TourManager Pro" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        ➕ Create Tour Package
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Create a new tour package with destinations, facilities, and pricing details
                    </p>
                </div>

                {/* Form */}
                <div className="max-w-4xl">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <span>📝</span>
                                        <span>Basic Information</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Enter the basic details for your tour package
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Package Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g., Bali Paradise Explorer"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe the tour package experience..."
                                            rows={4}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="price">Price (USD)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="0.00"
                                                className={errors.price ? 'border-red-500' : ''}
                                            />
                                            {errors.price && (
                                                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="max_capacity">Max Capacity</Label>
                                            <Input
                                                id="max_capacity"
                                                type="number"
                                                min="1"
                                                value={data.max_capacity}
                                                onChange={(e) => setData('max_capacity', e.target.value)}
                                                placeholder="e.g., 20"
                                                className={errors.max_capacity ? 'border-red-500' : ''}
                                            />
                                            {errors.max_capacity && (
                                                <p className="text-red-500 text-sm mt-1">{errors.max_capacity}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="start_date">Start Date</Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                className={errors.start_date ? 'border-red-500' : ''}
                                            />
                                            {errors.start_date && (
                                                <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="end_date">End Date</Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                className={errors.end_date ? 'border-red-500' : ''}
                                            />
                                            {errors.end_date && (
                                                <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Destinations and Facilities */}
                            <div className="space-y-6">
                                {/* Destinations */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <span>🗺️</span>
                                            <span>Destinations</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Add destinations included in this package
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {destinationInputs.map((destination, index) => (
                                            <div key={index} className="flex space-x-2">
                                                <Input
                                                    type="text"
                                                    value={destination}
                                                    onChange={(e) => handleDestinationChange(index, e.target.value)}
                                                    placeholder={`Destination ${index + 1}`}
                                                    className="flex-1"
                                                />
                                                {destinationInputs.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeDestination(index)}
                                                    >
                                                        ❌
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addDestination}
                                        >
                                            ➕ Add Destination
                                        </Button>
                                        {errors.destinations && (
                                            <p className="text-red-500 text-sm">{errors.destinations}</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Facilities */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <span>🏨</span>
                                            <span>Facilities</span>
                                        </CardTitle>
                                        <CardDescription>
                                            List the facilities and services included
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {facilityInputs.map((facility, index) => (
                                            <div key={index} className="flex space-x-2">
                                                <Input
                                                    type="text"
                                                    value={facility}
                                                    onChange={(e) => handleFacilityChange(index, e.target.value)}
                                                    placeholder={`e.g., ${index === 0 ? 'Airport Transfer' : index === 1 ? '5-star Hotel' : 'Guided Tours'}`}
                                                    className="flex-1"
                                                />
                                                {facilityInputs.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeFacility(index)}
                                                    >
                                                        ❌
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addFacility}
                                        >
                                            ➕ Add Facility
                                        </Button>
                                        {errors.facilities && (
                                            <p className="text-red-500 text-sm">{errors.facilities}</p>
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
                                disabled={processing}
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
                                        <span>Create Package</span>
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