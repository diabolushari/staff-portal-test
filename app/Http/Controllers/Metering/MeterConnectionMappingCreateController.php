<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterService;
use App\Services\Parameters\ParameterValueService;
use Inertia\Inertia;

class MeterConnectionMappingCreateController extends Controller
{
    public function __construct(
        private readonly MeterService $meterService,
        private readonly MeterConnectionMappingService $meterConnectionMappingService,
        private readonly ParameterValueService $parameterValueService,
        private readonly ConnectionService $connectionService,
    ) {}

    public function __invoke(int $id)
    {
        // TODO loading all data
        $meters = $this->meterService->listMeters();
        $connection = $this->connectionService->getConnection($id);
        $meterRelations = $this->meterConnectionMappingService->listMeterConnectionMappings();
        $meterRelationIds = array_column($meterRelations->data, 'meter_id');
        $unrelatedMeters = array_filter($meters->data, function ($meter) use ($meterRelationIds) {
            return ! in_array($meter['meter_id'], $meterRelationIds);
        });
        $unrelatedMeters = array_values($unrelatedMeters);
        $useCategory = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Use Category');
        $meterStatus = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Status');
        $changeReason = $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Change Reason');

        return Inertia::render('Connections/ConnectMeter', [
            'connection_id' => $id,
            'connection' => $connection->data,
            'meters' => $unrelatedMeters,
            'useCategory' => $useCategory->data,
            'meterStatus' => $meterStatus->data,
            'changeReason' => $changeReason->data,
        ]);
    }
}
