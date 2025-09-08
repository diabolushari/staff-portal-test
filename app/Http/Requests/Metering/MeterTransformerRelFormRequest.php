<?php

namespace App\Http\Requests\Metering;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MeterTransformerRelFormRequest extends Data
{
    public function __construct(
        public ?int $version_id,
        public ?int $ctpt_id,
        public ?int $meter_id,
        public ?string $faulty_date,
        public ?string $ctpt_energise_date,
        public ?string $ctpt_change_date,
        public ?int $status_id,
        public ?int $change_reason_id,
        public ?string $effective_start_ts,
        public ?string $effective_end_ts,
        public ?string $created_ts,
        public ?string $updated_ts,
        public ?int $created_by,
        public ?int $updated_by,
        public ?bool $is_active,
    ) {}
}

