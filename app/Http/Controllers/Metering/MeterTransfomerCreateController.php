<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTransformerRelService;
use App\Services\Metering\MeterTransformerService;
use App\Services\Parameters\ParameterValueService;
use Inertia\Inertia;
use Inertia\Response;

class MeterTransfomerCreateController extends Controller
{
    public function __construct(
        private readonly MeterTransformerService $meterTransformerService,
        private readonly MeterService $meterService,
        private readonly MeterTransformerRelService $relService,
        private readonly ParameterValueService $parameterValueService
    ) {}

    public function __invoke(int $meterId): Response
    {
        // Fetch dropdowns
        $ctpts = $this->meterTransformerService->listUnassignedTransformers();
        $meter = $this->meterService->getMeter($meterId);

        $parameterRequests = [
            'statuses' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter CTPT', 'Status')->data,
            'changeReasons' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter CTPT', 'Change Reason')->data,
        ];

        return Inertia::render('MeterTransformerRel/MeterTransformerRelForm', [
            'ctpts' => $ctpts->data,
            'meter' => $meter->data,
            ...$parameterRequests,
        ]);
    }
}
