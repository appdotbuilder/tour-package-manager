<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Booking
 *
 * @property int $id
 * @property int $tour_package_id
 * @property int $agent_id
 * @property string $customer_name
 * @property string $customer_email
 * @property string $customer_phone
 * @property int $number_of_people
 * @property float $total_amount
 * @property float $agent_commission
 * @property string $status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\TourPackage $tourPackage
 * @property-read \App\Models\User $agent
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Booking newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking query()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereTourPackageId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereAgentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereCustomerName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereCustomerEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereCustomerPhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereNumberOfPeople($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereAgentCommission($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereUpdatedAt($value)
 * @method static \Database\Factories\BookingFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Booking extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'tour_package_id',
        'agent_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'number_of_people',
        'total_amount',
        'agent_commission',
        'status',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_amount' => 'decimal:2',
        'agent_commission' => 'decimal:2',
    ];

    /**
     * Get the tour package for this booking.
     */
    public function tourPackage(): BelongsTo
    {
        return $this->belongsTo(TourPackage::class);
    }

    /**
     * Get the agent for this booking.
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}