<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTransformerService;
use App\Services\Parameters\ParameterValueService;
use Inertia\Inertia;
use Inertia\Response;

class MeterTransfomerCreateController extends Controller
{
    public function __construct(
        private readonly MeterTransformerService $meterTransformerService,
        private readonly MeterService $meterService,
        private readonly ParameterValueService $parameterValueService,
        private readonly ConnectionService $connectionService
    ) {}

    public function __invoke(int $connectionId, int $meterId): Response
    {
        // Fetch dropdowns
        $ctpts = $this->meterTransformerService->listUnassignedTransformers();
        $meter = $this->meterService->getMeter($meterId);
        $connection = $this->connectionService->getConnection($connectionId);

        $parameterRequests = [
            'statuses' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter CTPT', 'Status')->data,
            'changeReasons' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter CTPT', 'Change Reason')->data,
        ];

        return Inertia::render('MeterTransformerRel/MeterTransformerRelForm', [
            'ctpts' => $ctpts->data,
            'meter' => $meter->data,
            'connection' => $connection->data,
            ...$parameterRequests,
        ]);
    }
}
