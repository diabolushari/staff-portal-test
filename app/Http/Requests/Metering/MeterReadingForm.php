<?php

namespace App\Http\Requests\Metering;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MeterReadingForm extends Data
{
    public function __construct(
        public int $connection_id,
        public string $readingType,
        public int $anomalyId,
        public string $meteringDate,
        public string $readingStartDate,
        public string $readingEndDate,
        public int $meterHealthId,
        public ?int $ctHealthId,
        public ?int $ptHealthId,
        public ?string $faultyDate,
        public int $ctptHealthId,
        public float $voltageR,
        public float $voltageB,
        public float $voltageY,
        public float $currentR,
        public float $currentB,
        public float $currentY,
        public string $remarks,
        public array $readingsByMeter,
    ) {}
}
