<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Connection\ConsumerService;
use App\Services\Metering\MeterConnectionRelService;
use App\Services\Metering\MeteringParameterProfileService;
use App\Services\Metering\MeterTimezoneTypeRelService;
use App\Services\MeteringTimezone\MeteringTimezoneService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GetMeterReadingController extends Controller
{
    public function __construct(
        private ConnectionService $connectionService,
        private ParameterValueService $parameterService,
        private ConsumerService $consumerService,
        private MeterConnectionRelService $meterConnectionRelService,
        private MeterTimezoneTypeRelService $meterTimezoneTypeRelService,
        private MeteringTimezoneService $meteringTimezoneService,
        private MeteringParameterProfileService $meteringParameterProfileService
    ) {}

    public function __invoke(Request $request, int $connectionId): Response
    {
        $meterHealthTypes = $this->parameterService->getParameterValues(1,
            100,
            null,
            'Meter',
            'Meter Health',
        );
        $ctptHealthTypes = $this->parameterService->getParameterValues(1,
            100,
            null,
            'Meter',
            'Meter CTPT Health',
        );

        $anomalyTypes = $this->parameterService->getParameterValues(1,
            100,
            null,
            'Meter',
            'Anomalies',
        );
        $connection = $this->connectionService->getConnection($connectionId);
        $consumer = $this->consumerService->getConsumer($connectionId);
        $meterConnectionRel = $this->meterConnectionRelService->getMeterConnectionRelByConnectionId($connectionId);
        $metersWithTimezonesAndProfiles = [];
        $meterTimezoneTypeRel = [];
        $timeZoneNames = [];
        if ($meterConnectionRel->data) {
            $meterWithTimezoneAndProfile = [];

            foreach ($meterConnectionRel->data as $meterConnectionRel) {
                if ($meterConnectionRel['meter_id'] == 2) {
                    $meterConnectionRel['meter_profile_id'] = '56';
                }
                if ($meterConnectionRel['meter_id'] == 1) {
                    $meterConnectionRel['meter_profile_id'] = '52';
                }
                $meterWithTimezoneAndProfile['meter_id'] = $meterConnectionRel['meter_id'];
                $data = $this->meterTimezoneTypeRelService->getActiveMeterTimezoneTypeRelByMeterId($meterConnectionRel['meter_id'])->data ?? [];
                $meterWithTimezoneAndProfile['meter_timezone_type'] = $data['timezone_type']['parameter_value'];
                $meterTimezoneTypeRel[] = $data;
                if ($data) {
                    $timeZonesResponse = $this->meteringTimezoneService->listMeteringTimezones(null, $data['timezone_type']['id'])->data;
                    $timezones = [];
                    if ($timeZonesResponse) {
                        foreach ($timeZonesResponse as $timeZone) {
                            $timeZoneItem['timezone_name'] = $timeZone['timezone_name']['parameter_value'];
                            $timeZoneItem['timezone_id'] = $timeZone['timezone_name']['id'];
                            $timezones[] = $timeZoneItem;
                        }
                    }
                    $meterWithTimezoneAndProfile['timezones'] = $timezones;
                }

                $meterProfilesResponse = $this->meteringParameterProfileService->listMeteringParameterProfiles(null, null, null, $meterConnectionRel['meter_profile_id'])->data;
                $meterProfiles = [];
                if ($meterProfilesResponse) {
                    foreach ($meterProfilesResponse as $meterProfile) {
                        $meterProfiles[] = $meterProfile;
                    }
                }
                $meterWithTimezoneAndProfile['meter_profile'] = $meterProfiles;

                $metersWithTimezonesAndProfiles[] = $meterWithTimezoneAndProfile;

            }
        }

        return Inertia::render('MeterReading/MeterReadingCreatePage', [
            'connectionWithConsumer' => [
                'connection' => $connection->data,
                'consumer' => $consumer->data['consumer'] ?? null,
            ],
            'meterHealthTypes' => $meterHealthTypes->data,
            'ctptHealthTypes' => $ctptHealthTypes->data,
            'anomalyTypes' => $anomalyTypes->data,
            'timeZoneNames' => $timeZoneNames,
            'metersWithTimezonesAndProfiles' => $metersWithTimezonesAndProfiles,
        ]);
    }
}
