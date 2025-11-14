<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class GetConnectionMeterController extends Controller
{
    public function __construct(
        protected MeterConnectionMappingService $meterConnectionMappingService,
        protected MeterService $meterService,
        protected ConnectionService $connectionService,
    ) {}

    public function __invoke(int $id): Response|RedirectResponse
    {
        $response = $this->meterConnectionMappingService->getMeterConnectionMapping($id);
        $connectionResponse = $this->connectionService->getConnection($id);
        if ($response->hasError()) {
            return back()->withErrors(['grpc_error' => $response->error]);
        }
        $meterConnectionRelResponse = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($id);
        $meterConnectionRels = $meterConnectionRelResponse->data;

        return Inertia::render('Connections/ConnectionMeterList', [
            'connectionId' => $id,
            'connection' => $connectionResponse->data,
            'meterConnectionRels' => $meterConnectionRels,

        ]);
    }
}
