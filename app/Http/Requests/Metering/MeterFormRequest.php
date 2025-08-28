<?php

namespace App\Http\Requests\Metering;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MeterFormRequest extends Data
{
    public function __construct(
        // Identifiers for updates, added by the controller/route
        public ?int $meterId,

        // Fields from the form, matching the protobuf request
        public string $meterSerial,
        public int $ownershipTypeId,
        public int $meterMakeId,
        public int $meterTypeId,
        public int $meterCategoryId,
        public int $accuracyClassId,
        public int $dialingFactor,
        public ?string $companySealNum,
        public ?int $digitCount,
        public ?float $voltageMeterRatio,
        public ?int $currentMeterRatio,
        public ?string $manufactureDate, // Dates are received as strings
        public ?string $supplyDate,
        public int $meterUnitId,
        public int $meterResetTypeId,
        public bool $smartMeterInd,
        public bool $bidirectionalInd,

        // Fields to be set by the system (e.g., from auth user)
        public ?int $createdBy,
        public ?int $updatedBy,
    ) {}
}
