<?php

namespace App\GrpcConverters\Metering;

use App\GrpcConverters\ParameterValueProtoConvertor;
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
            'faulty_date' => $rel->hasFaultyDate() ? $rel->getFaultyDate() : null,
            'ctpt_energise_date' => $rel->hasCtptEnergiseDate() ? $rel->getCtptEnergiseDate()->toDateTime()->format('Y-m-d') : null,
            'ctpt_change_date' => $rel->hasCtptChangeDate() ? $rel->getCtptChangeDate()->toDateTime()->format('Y-m-d') : null,
            'status_id' => $rel->getStatusId(),
            'change_reason_id' => $rel->getChangeReasonId(),
            'created_ts' => $rel->hasCreatedTs() ? $rel->getCreatedTs() : null,
            'updated_ts' => $rel->hasUpdatedTs() ? $rel->getUpdatedTs() : null,
            'created_by' => $rel->getCreatedBy(),
            'updated_by' => $rel->getUpdatedBy(),
            'status' => $rel->hasStatus() ? ParameterValueProtoConvertor::convertToArray($rel->getStatus()) : null,
            'change_reason' => $rel->hasChangeReason() ? ParameterValueProtoConvertor::convertToArray($rel->getChangeReason()) : null,
            'ctpt' => $rel->hasCtpt() ? MeterTransformerProtoConvertor::convertToArray($rel->getCtpt()) : null,
        ];
    }
}
