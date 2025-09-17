<?php

namespace App\Http\Requests\Metering;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MeterConnectionRelFormRequest extends Data
{
    public function __construct(
        // Identifier for updates, can be added by the controller/route
        public ?int $relId,

        // Fields from the form, matching the protobuf request
        public int $meterId,
        public int $connectionId,
        public int $meterUseCategory,
        public bool $bidirectionalInd,
        public ?string $meterBillingMode,
        public int $meterStatusId,
        public ?string $faultyDate, // Dates are received as strings
        public ?string $rectificationDate,
        public int $changeReason,
        public ?string $effectiveStartTs,
        public ?string $effectiveEndTs,
        public ?bool $isActive,

        // Fields to be set by the system (e.g., from auth user)
        public ?int $createdBy,
        public ?int $updatedBy,
    ) {}
}
