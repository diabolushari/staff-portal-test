<?php

declare(strict_types=1);

namespace App\GrpcConverters;

use Proto\Consumers\MeterResponse;

class MeterProtoConvertor
{
    /**
     * Convert MeterResponse proto to array.
     *
     * @return array{
     *     version_id: int,
     *     meter_id: int,
     *     meter_serial: string,
     *     profile_id: int|string,
     *     ownership_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     meter_profile: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     meter_make: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     meter_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     meter_category: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     accuracy_class: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     dialing_factor: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     company_seal_num: string,
     *     digit_count: int,
     *     manufacture_date: string|null,
     *     supply_date: string|null,
     *     meter_unit: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     meter_reset_type: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     smart_meter_ind: bool,
     *     bidirectional_ind: bool,
     *     meter_phase: array{id: int|string, parameter_value: string, parameter_code: string, attribute1_value: string, attribute2_value: string, attribute3_value: string, attribute4_value: string, attribute5_value: string, is_active: bool, sort_priority: int, notes: string}|null,
     *     decimal_digit_count: int,
     *     programmable_pt_ratio: float,
     *     programmable_ct_ratio: int,
     *     meter_mf: float,
     *     warranty_period: int,
     *     meter_constant: int,
     *     batch_code: string,
     *     internal_ct_primary: int,
     *     internal_ct_secondary: int,
     *     internal_pt_primary: int,
     *     internal_pt_secondary: int,
     *     created_ts: string|null,
     *     updated_ts: string|null,
     *     created_by: int,
     *     updated_by: int
     * }|null
     */
    public static function convertToArray(?MeterResponse $meter): ?array
    {
        if ($meter === null) {
            return null;
        }

        $manufactureDate = ($meter->hasManufactureDate() && $meter->getManufactureDate())
        ? $meter->getManufactureDate()->toDateTime()->format('Y-m-d')
        : null;

        $supplyDate = ($meter->hasSupplyDate() && $meter->getSupplyDate())
            ? $meter->getSupplyDate()->toDateTime()->format('Y-m-d')
            : null;

        // created_ts and updated_ts are not optional in the proto
        $createdTs = $meter->getCreatedTs()
            ? $meter->getCreatedTs()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        $updatedTs = $meter->getUpdatedTs()
            ? $meter->getUpdatedTs()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        return [
            'version_id' => $meter->getVersionId(),
            'meter_id' => $meter->getMeterId(),
            'meter_serial' => $meter->getMeterSerial(),
            'profile_id' => $meter->getProfileId(),
            'ownership_type' => ParameterValueProtoConvertor::convertToArray($meter->getOwnershipType()),
            'meter_profile' => ParameterValueProtoConvertor::convertToArray($meter->getProfile()),
            'meter_make' => ParameterValueProtoConvertor::convertToArray($meter->getMeterMake()),
            'meter_type' => ParameterValueProtoConvertor::convertToArray($meter->getMeterType()),
            'meter_category' => ParameterValueProtoConvertor::convertToArray($meter->getMeterCategory()),
            'accuracy_class' => ParameterValueProtoConvertor::convertToArray($meter->getAccuracyClass()),
            'dialing_factor' => ParameterValueProtoConvertor::convertToArray($meter->getDialingFactor()),
            'company_seal_num' => $meter->getCompanySealNum(),
            'digit_count' => $meter->getDigitCount(),
            'manufacture_date' => $manufactureDate,
            'supply_date' => $supplyDate,
            'meter_unit' => ParameterValueProtoConvertor::convertToArray($meter->getMeterUnit()),
            'meter_reset_type' => ParameterValueProtoConvertor::convertToArray($meter->getMeterResetType()),
            'smart_meter_ind' => $meter->getSmartMeterInd(),
            'bidirectional_ind' => $meter->getBidirectionalInd(),
            'meter_phase' => ParameterValueProtoConvertor::convertToArray($meter->getMeterPhase()),
            'decimal_digit_count' => $meter->getDecimalDigitCount(),
            'programmable_pt_ratio' => $meter->getProgrammablePtRatio(),
            'programmable_ct_ratio' => $meter->getProgrammableCtRatio(),
            'meter_mf' => $meter->getMeterMf(),
            'warranty_period' => $meter->getWarrantyPeriod(),
            'meter_constant' => $meter->getMeterConstant(),
            'batch_code' => $meter->getBatchCode(),
            'internal_ct_primary' => $meter->getInternalCtPrimary(),
            'internal_ct_secondary' => $meter->getInternalCtSecondary(),
            'internal_pt_primary' => $meter->getInternalPtPrimary(),
            'internal_pt_secondary' => $meter->getInternalPtSecondary(),
            'created_ts' => $createdTs,
            'updated_ts' => $updatedTs,
            'created_by' => $meter->getCreatedBy(),
            'updated_by' => $meter->getUpdatedBy(),

        ];
    }
}
