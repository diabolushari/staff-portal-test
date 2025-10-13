<?php

namespace App\Http\Requests\Connections;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ConsumerFormRequest extends Data
{
    public function __construct(
        public ?int $addressId,
        public int $connectionId,
        public int $consumerTypeId,
        public string $organizationName,
        public string $applicantCode,
        public string $consumerPan,
        public string $consumerTan,
        public string $consumerGstin,
        public bool $incomeTaxWithholdingInd,
        public bool $gstWithholdingInd,
        public string $addressLine1,
        public string $addressLine2,
        public string $cityTownVillage,
        public int $pincode,
        public int $districtId,
        public int $stateId,
        public string $primaryEmail,
        public string $primaryPhone,
        /** @var string[]|null */
        public ?array $otherAddresses,
        public ?array $contactFolio,
        public string $consumerCin,
        public bool $seasonalInd,
        public bool $licenseInd,
        public bool $openAccessInd,

    ) {}
}
