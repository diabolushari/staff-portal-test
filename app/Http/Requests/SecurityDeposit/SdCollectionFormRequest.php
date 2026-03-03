<?php

namespace App\Http\Requests\SecurityDeposit;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

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
    /** @var AttributeFormRequest[] */
    public ?array $attributeData,
  ) {}
}
