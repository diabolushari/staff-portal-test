<?php

namespace App\GrpcConverters\GeneratingStation;

use App\GrpcConverters\Connection\AddressProtoConverter;
use App\GrpcConverters\Connection\ConnectionProtoConverter;
use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\GeneratingStation\GeneratingStationMessage;

class GeneratingStationConverter
{
    /**
     * Convert GeneratingStationMessage proto to array
     */
    public static function convertToArray(
        ?GeneratingStationMessage $station
    ): ?array {

        if ($station === null) {
            return null;
        }

        $attributes = [];
        foreach ($station->getAttributes() as $attr) {
            $attributes[] = GeneratingStationAttributeConverter::convertToArray($attr);
        }

        return [
            'station_id' => $station->getStationId(),
            'connection_id' => $station->getConnectionId() ?: null,

            'station_name' => $station->getStationName(),
            'generation_status_id' => $station->getGenerationStatusId(),
            'installed_capacity' => $station->getInstalledCapacity(),

            'generation_type_id' => $station->getGenerationTypeId(),
            'voltage_category_id' => $station->getVoltageCategoryId(),
            'plant_type_id' => $station->getPlantTypeId(),

            'commissioning_date' => $station->getCommissioningDate(),

            'is_active' => $station->getIsActive(),
            'generation_status' => $station->hasGenerationStatus()
                ? ParameterValueProtoConvertor::convertToArray(
                    $station->getGenerationStatus()
                )
                : null,

            'generation_type' => $station->hasGenerationType()
                ? ParameterValueProtoConvertor::convertToArray(
                    $station->getGenerationType()
                )
                : null,

            'voltage_category' => $station->hasVoltageCategory()
                ? ParameterValueProtoConvertor::convertToArray(
                    $station->getVoltageCategory()
                )
                : null,

            'plant_type' => $station->hasPlantType()
                ? ParameterValueProtoConvertor::convertToArray(
                    $station->getPlantType()
                )
                : null,

            'address' => $station->hasAddress()
                ? AddressProtoConverter::addressToArray(
                    $station->getAddress()
                )
                : null,

            'connection' => $station->hasConnection()
                ?  ConnectionProtoConverter::convertToArray(
                    $station->getConnection()
                ) : null,

            'attributes' => $attributes,
        ];
    }
}
