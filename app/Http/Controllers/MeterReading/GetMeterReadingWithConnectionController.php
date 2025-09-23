<?php

namespace App\Http\Controllers\MeterReading;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionRelService;
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
    ) {}

    public function __invoke(Request $request, int $connectionId): Response
    {
        $connection = $this->connectionService->getConnection($connectionId);
        $meterConnectionRelResponse = $this->meterConnectionRelService->getMeterConnectionRelByConnectionId($connectionId);
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
        } else {
            $meters = [];
        }

        return Inertia::render('MeterReading/ConnectionMeterReadingPage', [
            'connection' => $connection->data,
            'meters' => $meters,
        ]);
    }
}
