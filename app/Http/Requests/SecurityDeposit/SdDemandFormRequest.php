<?php

namespace App\Http\Requests\SecurityDeposit;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class SdDemandFormRequest extends Data
{
    public function __construct(
        public int $connectionId,
        public string $demandTypeId,
        public ?string $calculationBasicId,
        public float $totalSdAmount,
        public string $calculationPeriodFrom,
        public string $calculationPeriodTo,
        public string $applicableFrom,
        public ?string $applicableTo,
        public int $statusId,
        public bool $isActive,
    ) {}
}
