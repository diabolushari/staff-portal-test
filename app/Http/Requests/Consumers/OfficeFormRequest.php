<?php

namespace App\Http\Requests\Consumers;

use Illuminate\Foundation\Http\FormRequest;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class OfficeFormRequest extends Data
{
    public function __construct(
        public string $officeName,
        public int $officeCode,
        public string $officeDescription,
        public int $officeTypeId,
        public ?int $parentOfficeId,
        public ?string $effectiveStart,
        public ?string $effectiveEnd,
        public ?array $contactFolio,
    ) {}
}
