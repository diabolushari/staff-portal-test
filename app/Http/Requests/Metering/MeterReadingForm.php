<?php

namespace App\Http\Requests\Metering;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MeterReadingForm extends Data
{
    public function __construct(
        public int $connectionId,
        public string $readingType,
        public int $anomalyId,
        public string $meteringDate,
        public string $readingStartDate,
        public string $readingEndDate,
        public float $voltageR,
        public float $voltageB,
        public float $voltageY,
        public float $currentR,
        public float $currentB,
        public float $currentY,
        public ?string $remarks,
        public array $readingsByMeter,
        public array $meterHealth,
        public ?bool $multipleReading,

    ) {}
}
