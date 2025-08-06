<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTourPackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'destinations' => 'required|array|min:1',
            'destinations.*' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'price' => 'required|numeric|min:0',
            'max_capacity' => 'required|integer|min:1',
            'available_slots' => 'required|integer|min:0',
            'facilities' => 'required|array|min:1',
            'facilities.*' => 'required|string|max:255',
            'status' => 'required|in:active,inactive,completed',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Tour package name is required.',
            'description.required' => 'Tour package description is required.',
            'destinations.required' => 'At least one destination is required.',
            'destinations.*.required' => 'Destination name cannot be empty.',
            'start_date.required' => 'Start date is required.',
            'end_date.required' => 'End date is required.',
            'end_date.after' => 'End date must be after start date.',
            'price.required' => 'Package price is required.',
            'price.numeric' => 'Package price must be a valid number.',
            'max_capacity.required' => 'Maximum capacity is required.',
            'max_capacity.integer' => 'Maximum capacity must be a whole number.',
            'max_capacity.min' => 'Maximum capacity must be at least 1.',
            'available_slots.required' => 'Available slots is required.',
            'available_slots.integer' => 'Available slots must be a whole number.',
            'facilities.required' => 'At least one facility is required.',
            'facilities.*.required' => 'Facility description cannot be empty.',
            'status.required' => 'Package status is required.',
            'status.in' => 'Package status must be active, inactive, or completed.',
        ];
    }
}