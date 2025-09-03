<?php

namespace App\Http\Requests\Connections;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class CreateConnectionFormRequest extends Data
{
    public function __construct(
        public int $connectionTypeId,
        public int $consumerNumber,
        public int $connectionStatusId,
        public string $connectedDate,
        public int $serviceOfficeCode,
        public int $adminOfficeCode,
        public int $voltageTypeId,
        public float $contractDemandKwVal,
        public float $connectedLoadKwVal,
        public int $tariffTypeId,
        public int $primaryPurposeId,
        public int $connectionCategoryId,
        public int $connectionSubcategoryId,
        public int $billingProcessId,
        public bool $solarIndicator,
        public ?int $openAccessTypeId,
        public ?int $meteringTypeId,
        public ?int $renewableTypeId,
        public bool $multiSourceIndicator,
        public bool $liveIndicator,
        public int $phaseTypeId,
        public ?string $consumerLegacyCode,

    ) {}
}
