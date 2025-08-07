<?php

namespace App\Http\Requests\Parameters;


use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Attributes\Validation\Required;

#[MapName(SnakeCaseMapper::class)]
class ParameterDefinitionFormRequest extends Data
{
    public function __construct(
        public string $name,
        public ?string $attribute1,
        public ?string $attribute2,
        public ?string $attribute3,
        public ?string $attribute4,
        public ?string $attribute5,
        public bool $isEffectiveDateDriven,

        #[Required]
        public int $domainId,
    ) {}
}
