<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tour_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->json('destinations')->comment('Array of destination names');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('price', 10, 2);
            $table->integer('max_capacity');
            $table->integer('available_slots');
            $table->json('facilities')->comment('Array of facility descriptions');
            $table->enum('status', ['active', 'inactive', 'completed'])->default('active');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('status');
            $table->index('start_date');
            $table->index(['status', 'start_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_packages');
    }
};