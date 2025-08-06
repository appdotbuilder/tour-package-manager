<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $booking = $this->route('booking');
        $user = auth()->user();
        
        // Admin can update any booking, agent can only update their own
        return $user?->isAdmin() || ($user?->isAgent() && $booking->agent_id === $user->id);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'number_of_people' => 'required|integer|min:1',
            'status' => 'required|in:pending,confirmed,cancelled,completed',
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
            'customer_name.required' => 'Customer name is required.',
            'customer_email.required' => 'Customer email is required.',
            'customer_email.email' => 'Please provide a valid email address.',
            'customer_phone.required' => 'Customer phone number is required.',
            'number_of_people.required' => 'Number of people is required.',
            'number_of_people.integer' => 'Number of people must be a whole number.',
            'number_of_people.min' => 'Number of people must be at least 1.',
            'status.required' => 'Booking status is required.',
            'status.in' => 'Invalid booking status.',
        ];
    }
}