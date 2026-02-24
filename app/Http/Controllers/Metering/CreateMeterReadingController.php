<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\GetReadingEntryService;
use App\Services\Metering\MeteringParameterProfileService;
use App\Services\Metering\MeterReadingService;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTimezoneTypeRelService;
use App\Services\MeteringTimezone\MeteringTimezoneService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreateMeterReadingController extends Controller
{
    public function __construct(
        private ConnectionService $connectionService,
        private ParameterValueService $parameterService,
        private MeterTimezoneTypeRelService $meterTimezoneTypeRelService,
        private MeteringTimezoneService $meteringTimezoneService,
        private MeteringParameterProfileService $meteringParameterProfileService,
        private MeterService $meterService,
        private MeterReadingService $meterReadingService,
        private GetReadingEntryService $getReadingEntryService,
    ) {}

    public function __invoke(Request $request, int $connectionId): Response
    {
        $meterHealthTypes = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'Meter',
            'Meter Health',
        );

        $interimReasons = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'Meter Reading',
            'Interim Reasons',
        );

        $ctHealthTypes = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'CTPT',
            'CT-Health Type',
        );


        $anomalyTypes = $this->parameterService->getParameterValues(
            1,
            100,
            null,
            'Meter',
            'Anomalies',
        );

        $connection = $this->connectionService->getConnection($connectionId);
        $metersWithTimezonesAndProfiles = [];
        $meterTimezoneTypeRel = [];
        $timeZoneNames = [];
        $latestMeterReading = $this->meterReadingService->latestMeterReading($connectionId);
        $latestMeterReadingGroupByMeter = $this->meterReadingService->latestMeterReadingGroupByMeter($connectionId);

        $getReadingEntryResponse = $this->getReadingEntryService->getReadingEntryData($connectionId);
        $uniqueMeters = $this->getReadingEntryService->getUniqueMeters($getReadingEntryResponse->data['meter_connection_mappings']);


        if ($uniqueMeters && count($uniqueMeters) > 0) {
            $meterWithTimezoneAndProfile = [];

            foreach ($uniqueMeters as $meterConnectionRel) {
                $meterWithTimezoneAndProfile['meter_id'] = $meterConnectionRel['meter_id'];
                $meter = $this->meterService->getMeter($meterConnectionRel['meter_id']);
                $meterWithTimezoneAndProfile['meter'] = $meter->data;
                $meterWithTimezoneAndProfile['meter_profile'] = $meterConnectionRel['meter_profile'] ?? null;
                $meterWithTimezoneAndProfile['meter_mf'] = $meterConnectionRel['meter_mf'] ?? null;
                $meterWithTimezoneAndProfile['meter_serial'] = $meter->data['meter_serial'] ?? null;
                $meterWithTimezoneAndProfile['meter_connection_mapping'] = $meterConnectionRel;

                $data = $this->meterTimezoneTypeRelService->getMeterTimezoneTypeRelByVersionId($meterConnectionRel['meter']['meter_timezone_type_rel'][0]['version_id'])->data ?? [];
                if (! empty($data)) {
                    $meterWithTimezoneAndProfile['meter_timezone_type'] = $data['timezone_type']['parameter_value'];
                    $meterTimezoneTypeRel[] = $data;

                    $timeZonesResponse = $this->meteringTimezoneService->listMeteringTimezones(null, $data['timezone_type']['id'])->data;
                    $timezones = [];
                    if (! empty($timeZonesResponse)) {
                        foreach ($timeZonesResponse as $timeZone) {
                            $timeZoneItem['timezone_name'] = $timeZone['timezone_name']['parameter_value'];
                            $timeZoneItem['timezone_id'] = $timeZone['timezone_name']['id'];
                            $timezones[] = $timeZoneItem;
                        }
                    }
                    $meterWithTimezoneAndProfile['timezones'] = $timezones;
                }

                $meterProfilesResponse = $this->meteringParameterProfileService->listMeteringProfileParameters(1, 10, null, $meterConnectionRel['meter_profile']['id'] ?? null)->data;
                $meterProfiles = [];
                if ($meterProfilesResponse) {
                    foreach ($meterProfilesResponse as $meterProfile) {
                        $meterProfiles[] = $meterProfile;
                    }
                }
                $meterWithTimezoneAndProfile['reading_parameters'] = $meterProfiles;

                $metersWithTimezonesAndProfiles[] = $meterWithTimezoneAndProfile;
            }
        }

        return Inertia::render('MeterReading/MeterReadingCreatePage', [
            'connectionWithConsumer' => [
                'connection' => $connection->data,
                'consumer' => $connection->data['consumer_profiles'][0] ?? null,
            ],
            'meterHealthTypes' => $meterHealthTypes->data,
            'anomalyTypes' => $anomalyTypes->data,
            'timeZoneNames' => $timeZoneNames,
            'metersWithTimezonesAndProfiles' => $metersWithTimezonesAndProfiles,
            'latestMeterReading' => $latestMeterReading->data,
            'ctHealthTypes' => $ctHealthTypes->data,
            'editMode' => false,
            'interimReasons' => $interimReasons->data,
            'latestMeterReadingGroupByMeter' => $latestMeterReadingGroupByMeter->data,
            'meterConnectionMappings' => $uniqueMeters
        ]);
    }
}
