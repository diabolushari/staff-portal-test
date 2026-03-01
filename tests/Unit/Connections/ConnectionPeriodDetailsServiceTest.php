<?php

use App\Services\Connection\ConnectionPeriodDetailsService;
use Proto\Connections\GetConnectionPeriodDetailsResponse;
use Proto\Connections\MeterPeriodDetails;
use Proto\Connections\ProfileHistoryItem;
use Proto\Connections\TimezoneHistoryItem;
use Proto\Metering\MeteringTimezoneResponse;
use Proto\MeteringProfile\MeteringProfileParameterMessage;
use Proto\Parameters\ParameterValueProto;
use Tests\TestCase;

uses(TestCase::class);

it('converts connection period details response to array', function () {
    $profile = (new ParameterValueProto)
        ->setId(12)
        ->setParameterValue('HT Profile');

    $profileParameter = (new MeteringProfileParameterMessage)
        ->setProfileId(12)
        ->setMeterParameterId(99)
        ->setName('kwh')
        ->setDisplayName('kWh')
        ->setIsExport(false)
        ->setIsCumulative(true)
        ->setProfile($profile);

    $profileHistory = (new ProfileHistoryItem)
        ->setProfile($profile)
        ->setProfileParameters([$profileParameter]);

    $timezoneType = (new ParameterValueProto)
        ->setId(3)
        ->setParameterValue('TOD');

    $timezoneName = (new ParameterValueProto)
        ->setId(8)
        ->setParameterValue('PEAK');

    $meteringTimezone = (new MeteringTimezoneResponse)
        ->setMeteringTimezoneId(42)
        ->setTimezoneType($timezoneType)
        ->setTimezoneName($timezoneName)
        ->setFromHrs(6)
        ->setToHrs(10);

    $timezoneHistory = (new TimezoneHistoryItem)
        ->setTimezoneType($timezoneType)
        ->setMeteringTimezones([$meteringTimezone]);

    $meter = (new MeterPeriodDetails)
        ->setMeterId(101)
        ->setProfiles([$profileHistory])
        ->setTimezones([$timezoneHistory]);

    $response = (new GetConnectionPeriodDetailsResponse)
        ->setConnections([])
        ->setMeters([$meter]);

    $service = new ConnectionPeriodDetailsService;
    $result = $service->toArray($response);

    expect($result['connections'])->toBe([])
        ->and($result['meters'][0]['meter_id'])->toBe(101)
        ->and($result['meters'][0]['profiles'][0]['profile']['id'])->toBe(12)
        ->and($result['meters'][0]['profiles'][0]['profile_parameters'][0]['meter_parameter_id'])->toBe(99)
        ->and($result['meters'][0]['timezones'][0]['timezone_type']['id'])->toBe(3)
        ->and($result['meters'][0]['timezones'][0]['metering_timezones'][0]['metering_timezone_id'])->toBe(42)
        ->and($result['meters'][0]['timezones'][0]['metering_timezones'][0]['timezone_name']['parameter_value'])->toBe('PEAK');
});
