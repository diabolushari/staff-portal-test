<?php

namespace App\Http\Controllers\MeterReading;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionRelService;
use App\Services\Metering\MeteringParameterProfileService;
use App\Services\Metering\MeterReadingService;
use App\Services\Metering\MeterReadingValueService;
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
        private MeterReadingValueService $meterReadingValueService,
        private MeteringParameterProfileService $meteringParameterProfileService,
    ) {}

    public function __invoke(Request $request, int $connectionId): Response
    {
        $connection = $this->connectionService->getConnection($connectionId);
        $meterReadingResponse = $this->meterReadingService->listMeterReadings($connectionId);
        $meterConnectionRelResponse = $this->meterConnectionRelService->getMeterConnectionRelByConnectionId($connectionId);
        $meterConnectionRels = $meterConnectionRelResponse->data;
        $meters = [];

        $meterReadingValues = [];
        $meterReadingValueswithMeterandParameters = [];
        $meterProfiles = [];

        if ($meterConnectionRels !== null) {
            foreach ($meterConnectionRels as $meterConnectionRel) {
                if (! isset($meterConnectionRel['meter_id'])) {
                    continue;
                }

                $meterResponse = $this->meterService->getMeter($meterConnectionRel['meter_id']);
                if ($meterResponse->hasError()) {
                    continue;
                }

                $meterId = $meterResponse->data['meter_id'];

                // Map profile IDs manually
                $profileId = match ($meterId) {
                    1 => 52,
                    2 => 56,
                    default => null
                };

                if ($profileId === null) {
                    continue;
                }

                // Fetch meter parameters
                $meterParametersResponse = $this->meteringParameterProfileService
                    ->listMeteringProfileParameters(1, 10, null, $profileId);
                $meterParameters = $meterParametersResponse->data ?? [];

                $profileItems = [];
                foreach ($meterParameters as $meterParameter) {
                    $meterReadingValueResponse = $this->meterReadingValueService
                        ->listMeterReadingValues(1, 10, null, $meterId, $meterParameter['meter_parameter_id']);

                    $values = ($meterReadingValueResponse->hasError() || empty($meterReadingValueResponse->data))
                        ? null
                        : $meterReadingValueResponse->data;

                    $profileItems[] = [
                        'meter_parameter' => $meterParameter,
                        'values' => $values, // null if no readings
                    ];
                }

                $meterProfiles[] = [
                    'meter_id' => $meterId,
                    'profile_id' => $profileId,
                    'profile_items' => $profileItems,
                ];
            }
        }

        return Inertia::render('MeterReading/ConnectionMeterReadingPage', [
            'connection' => $connection->data,
            'meters' => $meters,
            'meterReadings' => $meterReadingResponse->data,
            'meterProfiles' => $meterProfiles,
        ]);

    }
}
