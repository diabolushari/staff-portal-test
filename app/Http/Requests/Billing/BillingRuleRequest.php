<?php

namespace App\Http\Requests\Billing;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BillingRuleRequest extends Data
{
    public function __construct(
        public ?int $billingRuleId,
        public string $name,
        public string $effectiveStart,
        public ?string $effectiveEnd,
        public UploadedFile $billingRule,
    ) {}
}
