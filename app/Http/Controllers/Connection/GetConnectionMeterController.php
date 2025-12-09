<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTransformerRelService;
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

        return Inertia::render('Connections/ConnectionMeterList', [
            'connectionId' => $id,
            'connection' => $connectionResponse->data,
            'ctptRelations' => $ctptRelations,
        ]);
    }
}
