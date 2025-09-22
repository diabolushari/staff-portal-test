<?php

namespace App\Http\Requests\Metering;

use GPBMetadata\Google\Type\Decimal;
use Spatie\LaravelData\Data;

class MeterReadingForm extends Data
{
    public function __construct(
        public string $connection_id,
        public Decimal $normal_pf,
        public Decimal $peak_pf,
        public Decimal $offpeak_pf,
        public Decimal $average_power_factor,
        public string $reading_type,
        public string $anomaly,
        public string $metering_date,
        public string $reading_start_date,
        public string $reading_end_date,
        public string $meter_health_id,
        public string $ctpt_health_id,
        public string $voltage_r,
        public string $voltage_b,
        public string $voltage_y,
        public string $current_r,
        public string $current_b,
        public string $current_y,
        public string $remarks,
    ) {}
}
