<?php

namespace App\GrpcConverters\Metering;

use App\GrpcConverters\Meter\MeterProtoConvertor;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Services\Metering\MeteringParameterProfileService;
use Proto\MeterReading\MeterReadingMessage;
use Proto\MeterReading\MeterReadingPowerFactorMessage;
use Proto\MeterReading\ReadingValueMessage;

class MeterReadingConverter
{

    /**
     * @return array<string, mixed>
     */
    public static function toArray(?MeterReadingMessage $detail): array
    {
        if ($detail === null) {
            return [];
        }
        $values = [];
        foreach ($detail->getValues() as $value) {
            $values[] = MeterReadingConverter::meterReadingValuesToArray($value);
        }
        $powerFactors = [];
        foreach ($detail->getPowerFactors() as $powerFactor) {
            $powerFactors[] = MeterReadingConverter::toProto($powerFactor);
        }

        return [
            'id' => $detail->getMeterReadingId(),
            'metering_date' => $detail->getMeteringDate(),
            'reading_start_date' => $detail->getReadingStartDate(),
            'reading_end_date' => $detail->getReadingEndDate(),
            'connection_id' => $detail->getConnectionId(),
            'single_reading' => $detail->getSingleReading(),
            'multiple_reading' => $detail->getMultipleReading(),
            'anomaly_id' => $detail->getAnomalyId(),
            'voltage_r' => $detail->getVoltageR(),
            'voltage_y' => $detail->getVoltageY(),
            'voltage_b' => $detail->getVoltageB(),
            'current_r' => $detail->getCurrentR(),
            'current_y' => $detail->getCurrentY(),
            'current_b' => $detail->getCurrentB(),
            'remarks' => $detail->getRemarks(),
            'created_by' => $detail->getCreatedBy(),
            'updated_by' => $detail->getUpdatedBy(),
            'is_active' => $detail->getIsActive(),
            'values' => $values,
            'power_factors' => $powerFactors,
        ];
    }

    public static function meterReadingValuesToArray(ReadingValueMessage $detail): array
    {
        return [
            'id' => $detail->getMeterReadingValuesId(),
            'meter_id' => $detail->getMeterId(),
            'parameter_id' => $detail->getParameterId(),
            'timezone_id' => $detail->getTimezoneId(),
            'initial_reading' => $detail->getInitialReading(),
            'final_reading' => $detail->getFinalReading(),
            'difference' => $detail->getDifference(),
            'value' => $detail->getMulValue(),
            'created_by' => $detail->getCreatedBy(),
            'updated_by' => $detail->getUpdatedBy(),
            'is_active' => $detail->getIsActive(),
            'time_zone' => ParameterValueProtoConvertor::convertToArray($detail->getTimezone()),
            'meter' => MeterProtoConvertor::convertToArray($detail->getMeter()),
            'meter_profile_parameter' => MeteringParameterProfileService::toArray($detail->getParameter()),
        ];
    }

    public static function toProto(MeterReadingPowerFactorMessage $powerFactor)
    {
        return [
            'id' => $powerFactor->getId(),
            'meter_reading_id' => $powerFactor->getMeterReadingId(),
            'average_power_factor' => $powerFactor->getAveragePowerFactor(),
            'created_by' => $powerFactor->getCreatedBy(),
            'updated_by' => $powerFactor->getUpdatedBy(),
            'created_ts' => $powerFactor->getCreatedTs(),
            'updated_ts' => $powerFactor->getUpdatedTs(),
        ];
    }
}
