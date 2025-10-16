<?php

namespace App\Http\Requests\Tariff;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class TariffConfigFormRequest extends Data
{
    public function __construct(
        public int $tariffOrderId,
        /** @var DataCollection<int, TariffConfigFormItems> */
        public DataCollection $tariffConfigItems,
    ) {}
}
