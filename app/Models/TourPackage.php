<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\TourPackage
 *
 * @property int $id
 * @property string $name
 * @property string $description
 * @property array $destinations
 * @property \Illuminate\Support\Carbon $start_date
 * @property \Illuminate\Support\Carbon $end_date
 * @property float $price
 * @property int $max_capacity
 * @property int $available_slots
 * @property array $facilities
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Booking> $bookings
 * @property-read int|null $bookings_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage query()
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereDestinations($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereMaxCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereAvailableSlots($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereFacilities($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TourPackage active()
 * @method static \Database\Factories\TourPackageFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class TourPackage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'destinations',
        'start_date',
        'end_date',
        'price',
        'max_capacity',
        'available_slots',
        'facilities',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'destinations' => 'array',
        'facilities' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'price' => 'decimal:2',
    ];

    /**
     * Get all bookings for this tour package.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Scope a query to only include active packages.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}