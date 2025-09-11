<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterConnectionRelService;
use App\Services\Metering\MeterService;
use App\Services\Parameters\ParameterValueService;
use Inertia\Inertia;
use Inertia\Response;

class MeterConnectionRelEditController extends Controller
{
    public function __construct(
        private readonly MeterService $meterService,
        private readonly MeterConnectionRelService $meterConnectionRelService,
        private readonly ParameterValueService $parameterValueService
    ) {}

    public function __invoke(int $relId): Response
    {
        $relation = $this->meterConnectionRelService->getMeterConnectionRel($relId);

        if ($relation->hasError()) {
            return redirect()->back()->withErrors(['grpc_error' => 'Could not fetch meter connection relation details.']);
        }

        $meters = $this->meterService->listMeters();
        $useCategory = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Use Category');
        $meterStatus = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Status');
        $changeReason = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Change Reason');

        return Inertia::render('Connections/EditConnectMeter', [
            'relation' => $relation->data,
            'meters' => $meters->data,
            'useCategory' => $useCategory->data,
            'meterStatus' => $meterStatus->data,
            'changeReason' => $changeReason->data,
        ]);
    }
}
