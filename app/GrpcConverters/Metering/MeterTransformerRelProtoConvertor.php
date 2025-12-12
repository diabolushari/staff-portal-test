<?php

namespace App\GrpcConverters\Metering;

use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Services\utils\DateTimeConverter;
use Proto\Metering\MeterTransformerRelMessage;

class MeterTransformerRelProtoConvertor
{
    /**
     * @return array<string, mixed>|null
     */
    public static function relProtoToArray(?MeterTransformerRelMessage $rel): ?array
    {
        if ($rel === null) {
            return null;
        }

        return [
            'version_id' => $rel->getVersionId(),
            'ctpt_id' => $rel->getCtptId(),
            'meter_id' => $rel->getMeterId(),
            'faulty_date' => $rel->hasFaultyDate() ? DateTimeConverter::converTimeStampToDate($rel->getFaultyDate()) : null,
            'ctpt_energise_date' => $rel->hasCtptEnergiseDate() ? DateTimeConverter::converTimeStampToDate($rel->getCtptEnergiseDate()) : null,
            'ctpt_change_date' => $rel->hasCtptChangeDate() ? DateTimeConverter::converTimeStampToDate($rel->getCtptChangeDate()) : null,
            'status_id' => $rel->getStatusId(),
            'change_reason_id' => $rel->getChangeReasonId(),
            'created_ts' => $rel->hasCreatedTs() ? DateTimeConverter::converTimeStampToDate($rel->getCreatedTs()) : null,
            'updated_ts' => $rel->hasUpdatedTs() ? DateTimeConverter::converTimeStampToDate($rel->getUpdatedTs()) : null,
            'created_by' => $rel->getCreatedBy(),
            'updated_by' => $rel->getUpdatedBy(),
            'status' => $rel->hasStatus() ? ParameterValueProtoConvertor::convertToArray($rel->getStatus()) : null,
            'change_reason' => $rel->hasChangeReason() ? ParameterValueProtoConvertor::convertToArray($rel->getChangeReason()) : null,
            'ctpt' => $rel->hasCtpt() ? MeterTransformerProtoConvertor::convertToArray($rel->getCtpt()) : null,
        ];
    }
}
