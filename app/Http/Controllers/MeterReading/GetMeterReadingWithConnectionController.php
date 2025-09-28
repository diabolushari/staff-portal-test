<?php

namespace App\Http\Controllers\MeterReading;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionRelService;
use App\Services\Metering\MeteringParameterProfileService;
use App\Services\Metering\MeterReadingService;
use App\Services\Metering\MeterReadingValueService;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTimezoneTypeRelService;
use App\Services\MeteringTimezone\MeteringTimezoneService;
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
        private MeterTimezoneTypeRelService $meterTimezoneTypeRelService,
        private MeteringTimezoneService $meteringTimezoneService,
    ) {}

    public function __invoke(Request $request, int $connectionId): Response
    {
        $connection = $this->connectionService->getConnection($connectionId);
        $meterReadingResponse = $this->meterReadingService->listMeterReadings($connectionId);
        $meterConnectionRelResponse = $this->meterConnectionRelService->getMeterConnectionRelByConnectionId($connectionId);
        $meterConnectionRels = $meterConnectionRelResponse->data;

        $meters = [];
        $readings = $this->meterReadingService->listMeterReadings(1, 100, null, $connectionId)->data;

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

                $meterId = $meterResponse->data['meter_id'] ?? null;
                $profileId = $meterResponse->data['profile_id'] ?? null;
                $meterTimezoneTypeRelResponse = $this->meterTimezoneTypeRelService->getActiveMeterTimezoneTypeRelByMeterId($meterId)->data ?? null;
                $timezoneId = $meterTimezoneTypeRelResponse['timezone_type']['id'] ?? null;
                $timzeZones = $this->meteringTimezoneService->listMeteringTimezones(null, $timezoneId)->data ?? [];
                // Fetch meter parameters
                $meterParametersResponse = $this->meteringParameterProfileService
                    ->listMeteringProfileParameters(1, 10, null, $profileId);
                $meterParameters = $meterParametersResponse->data ?? [];

                $profileItems = [];
                foreach ($meterParameters as $meterParameter) {
                    $readingValues = [];
                    foreach ($readings as $reading) {
                        $values = [];
                        foreach ($timzeZones as $timzeZone) {
                            $value = $this->meterReadingValueService->getMeterReadingValues(null, $meterId, $meterParameter['meter_parameter_id'], $timzeZone['timezone_name']['id'], $reading['id'])->data;
                            if ($value === null) {
                                continue;
                            }
                            $values[] = [
                                $timzeZone['timezone_name']['parameter_value'] => $value,
                            ];
                        }
                        $readingValues[] = [
                            'reading' => $reading,
                            'values' => $values,
                        ];
                    }
                    $profileItems[] = [
                        'meter_parameter' => $meterParameter,
                        'reading_values' => $readingValues,
                    ];
                }

                $meterProfiles[] = [
                    'meter_id' => $meterId,
                    'profile_id' => $profileId,
                    'timezone_id' => $timezoneId,
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
