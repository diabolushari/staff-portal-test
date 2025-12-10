<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTransformerRelService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class GetConnectionMeterController extends Controller
{
    public function __construct(
        protected MeterConnectionMappingService $meterConnectionMappingService,
        protected MeterService $meterService,
        protected ConnectionService $connectionService,
        protected MeterTransformerRelService $meterTransformerRelService,
        protected ParameterValueService $parameterValueService,
    ) {}

    public function __invoke(int $id): Response|RedirectResponse
    {
        $connectionResponse = $this->connectionService->getConnection($id);

        if ($connectionResponse->hasError()) {
            return back()->withErrors(['grpc_error' => $connectionResponse->error]);
        }

        $meterConnectionMappingsResponse = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($id);

        $ctptRelations = [];
        if (! $meterConnectionMappingsResponse->hasError() && ! empty($meterConnectionMappingsResponse->data)) {
            $meterIds = array_map(fn ($mapping) => $mapping['meter_id'], $meterConnectionMappingsResponse->data);

            $ctptResponse = $this->meterTransformerRelService->listAssignedToMeters($meterIds);
            if (! $ctptResponse->hasError()) {
                $ctptRelations = $ctptResponse->data;
            }
        }
        $status = $this->parameterValueService->getParameterValues(null,null,null,'Meter','Status');
        $changeReason = $this->parameterValueService->getParameterValues(null,null,null,'Meter','Change Reason');

        return Inertia::render('Connections/ConnectionMeterList', [
            'connection_id' => $id,
            'connection' => $connectionResponse->data,
            'ctpt_relations' => $ctptRelations,
            'status' => $status->data,
            'change_reason' => $changeReason->data,
        ]);
    }
}
