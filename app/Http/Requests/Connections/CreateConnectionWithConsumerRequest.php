<?php

namespace App\Http\Requests\Connections;

use App\Http\Requests\Connections\Data\ConnectionData;
use App\Http\Requests\Connections\Data\ConsumerProfileData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class CreateConnectionWithConsumerRequest extends Data
{
    public function __construct(
        public ConnectionData $connection,
        public ConsumerProfileData $consumerProfile
    ) {}
}
