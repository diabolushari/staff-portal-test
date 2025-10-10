<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterService;
use Inertia\Inertia;

class GetConnectionMeterController extends Controller
{
    public function __construct(
        protected MeterConnectionMappingService $meterConnectionMappingService,
        protected MeterService $meterService,
        protected ConnectionService $connectionService,
    ) {}

    public function __invoke(int $id)
    {
        $response = $this->meterConnectionMappingService->getMeterConnectionMapping($id);
        $connectionResponse = $this->connectionService->getConnection($id);
        if ($response->hasError()) {
            return back()->withErrors(['grpc_error' => $response->error]);
        }
        $meterConnectionRelResponse = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($id);
        $meterConnectionRels = $meterConnectionRelResponse->data;
        $meters = [];

        if ($meterConnectionRels !== null) {
            foreach ($meterConnectionRels as $meterConnectionRel) {
                if (isset($meterConnectionRel['meter_id'])) {
                    $meterResponse = $this->meterService->getMeter($meterConnectionRel['meter_id']);
                    if (! $meterResponse->hasError()) {
                        $meters[] = [
                            'relationship' => $meterConnectionRel,
                            'meter' => $meterResponse->data,
                        ];
                    }
                }
            }
        }

        return Inertia::render('Connections/ConnectionMeterList', [
            'connectionId' => $id,
            'connection' => $connectionResponse->data,
            'meters' => $meters,
        ]);
    }
}
