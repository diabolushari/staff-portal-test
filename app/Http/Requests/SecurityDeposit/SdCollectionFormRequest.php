<?php

namespace App\Http\Requests\SecurityDeposit;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Illuminate\Http\UploadedFile;

#[MapName(SnakeCaseMapper::class)]
class SdCollectionFormRequest extends Data
{
    public function __construct(
       
        public int $sdDemandId,
        public string $collectionDate,
        public int $collectionModeId,
        public string $collectionAmount,
        public ?string $receiptNumber,
        public ?string $collectedBy,
        public ?string $reversalReason,
        public ?string $reversedDate,
        public ?string $reversedBy,
        public ?int $attributeDefinitionId,
        public ?string $attributeValue,
        public ?bool $isVerified,
        public ?string $verifiedDate,
        public ?string $expiryDate,
        public ?UploadedFile $documentPath,
    ) {}
}
