<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tour_package_id' => 'required|exists:tour_packages,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'number_of_people' => 'required|integer|min:1',
            'notes' => 'nullable|string',
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
            'tour_package_id.required' => 'Tour package selection is required.',
            'tour_package_id.exists' => 'Selected tour package does not exist.',
            'customer_name.required' => 'Customer name is required.',
            'customer_email.required' => 'Customer email is required.',
            'customer_email.email' => 'Please provide a valid email address.',
            'customer_phone.required' => 'Customer phone number is required.',
            'number_of_people.required' => 'Number of people is required.',
            'number_of_people.integer' => 'Number of people must be a whole number.',
            'number_of_people.min' => 'Number of people must be at least 1.',
        ];
    }
}