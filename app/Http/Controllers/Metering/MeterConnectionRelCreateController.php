<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterConnectionRelService;
use App\Services\Metering\MeterService;
use App\Services\Parameters\ParameterValueService;
use Inertia\Inertia;

class MeterConnectionRelCreateController extends Controller
{
    public function __construct(
        private readonly MeterService $meterService,
        private readonly MeterConnectionRelService $meterConnectionRelService,
        private readonly ParameterValueService $parameterValueService
    ) {}

    public function __invoke(int $Id)
    {
        $existingRelResponse = $this->meterConnectionRelService->getMeterConnectionRelByConnectionId($Id);

        if ($existingRelResponse->data !== null) {
            return redirect()->route('connections.show', ['connection' => $Id])->withErrors(['grpc_error' => 'Connection already has a meter assigned.']);
        }

        $meters = $this->meterService->listMeters();
        $meterRelations = $this->meterConnectionRelService->listMeterConnectionRels();
        $meterRelationIds = array_column($meterRelations->data, 'meter_id');
        $unrelatedMeters = array_filter($meters->data, function ($meter) use ($meterRelationIds) {
            return ! in_array($meter['meter_id'], $meterRelationIds);
        });

        $useCategory = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Use Category');
        $meterStatus = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Status');
        $changeReason = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Change Reason');

        return Inertia::render('Connections/ConnectMeter', [
            'connection_id' => $Id,
            'meters' => $unrelatedMeters,
            'useCategory' => $useCategory->data,
            'meterStatus' => $meterStatus->data,
            'changeReason' => $changeReason->data,
        ]);
    }
}
