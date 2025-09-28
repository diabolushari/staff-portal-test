<?php

namespace App\Http\Requests\Metering;

use Spatie\LaravelData\Data;

class MeterReadingForm extends Data
{
    public function __construct(
        public int $connection_id,
        public ?float $normal_pf,
        public ?float $peak_pf,
        public ?float $offpeak_pf,
        public ?float $average_power_factor,
        public string $reading_type,
        public int $anomaly_id,
        public string $metering_date,
        public string $reading_start_date,
        public string $reading_end_date,
        public int $meter_health_id,
        public int $ctpt_health_id,
        public float $voltage_r,
        public float $voltage_b,
        public float $voltage_y,
        public float $current_r,
        public float $current_b,
        public float $current_y,
        public string $remarks,
        public array $readings_by_meter,
    ) {}
}
