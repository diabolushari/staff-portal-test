<?php

namespace App\Http\Controllers\MeterReading;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionRelService;
use App\Services\Metering\MeterReadingService;
use App\Services\Metering\MeterService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GetMeterReadingWithConnectionController extends Controller
{
    public function __construct(
        private ConnectionService $connectionService,
        private MeterService $meterService,
        private MeterConnectionRelService $meterConnectionRelService,
        private MeterReadingService $meterReadingService,
    ) {}

    public function __invoke(Request $request, int $connectionId): Response
    {
        $connection = $this->connectionService->getConnection($connectionId);
        $meterReadingResponse = $this->meterReadingService->listMeterReadings(1, 100, null, $connectionId);
        $meterConnectionRelResponse = $this->meterConnectionRelService->getMeterConnectionRelByConnectionId($connectionId);
        $meterConnectionRels = $meterConnectionRelResponse->data;

        $meters = [];

        if ($meterConnectionRels !== null) {
            foreach ($meterConnectionRels as $meterConnectionRel) {
                if (! isset($meterConnectionRel['meter_id'])) {
                    continue;
                }
                $meterResponse = $this->meterService->getMeter($meterConnectionRel['meter_id']);
                if ($meterResponse->hasError()) {
                    continue;
                }
                $meterId = $meterResponse->data['meter_id'] ?? null;
                $meters[] = [
                    'meter_id' => $meterId,
                ];
            }
        }

        return Inertia::render('MeterReading/ConnectionMeterReadingPage', [
            'connection' => $connection->data,
            'meters' => $meters,
            'meterReadings' => $meterReadingResponse->data,
        ]);

    }
}
