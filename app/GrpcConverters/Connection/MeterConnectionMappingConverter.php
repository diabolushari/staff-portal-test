<?php 


namespace App\GrpcConverters\Connection;

use App\GrpcConverters\MeterProtoConvertor;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\Connections\ConnectionMeterChangeReasonFormRequest;
use App\Http\Requests\Connections\ConnectionMeterStatusFormRequest;
use App\Services\utils\DateTimeConverter;
use Proto\Metering\MeterConnectionMappingResponse;
use Proto\Metering\UpdateMeterConnectionChangeReasonRequest;
use Proto\Metering\UpdateMeterConnectionStatusRequest;

class MeterConnectionMappingConverter
{
    public static function arrayToUpdateMeterConnectionStatusRequest(ConnectionMeterStatusFormRequest $data): UpdateMeterConnectionStatusRequest
    {
        $request = new UpdateMeterConnectionStatusRequest();
        $request->setRelId($data->relId);
        $request->setMeterStatusId($data->statusId);
        $noticeDate = DateTimeConverter::convertStringToTimestamp($data->noticeDate);
        if ($noticeDate != null) {
            $request->setNoticeDate($noticeDate);
        }
        $intimationDate = DateTimeConverter::convertStringToTimestamp($data->intimationDate);
        if ($intimationDate != null) {
            $request->setIntimationDate($intimationDate);
        }
        return $request;
    }

    public static function arrayToUpdateMeterConnectionChangeRequest(ConnectionMeterChangeReasonFormRequest $data): UpdateMeterConnectionChangeReasonRequest
    {
        $request = new UpdateMeterConnectionChangeReasonRequest();
        $request->setRelId($data->relId);
        $request->setChangeReason($data->changeReasonId);
        $changeDate = DateTimeConverter::convertStringToTimestamp($data->changeDate);
        if ($changeDate != null) {
            $request->setChangeDate($changeDate);
        }
        return $request;
    }

    /**
     * @return array<string, mixed>
     */
    public function meterConnectionMappingProtoToArray(MeterConnectionMappingResponse $rel): array
    {
        $faultyDate = $rel->getFaultyDate() ? $rel->getFaultyDate()->toDateTime()->format('Y-m-d') : null;
        $rectificationDate = $rel->getRectificationDate() ? $rel->getRectificationDate()->toDateTime()->format('Y-m-d') : null;
        $effectiveStartTs = $rel->getEffectiveStartTs() ? $rel->getEffectiveStartTs()->toDateTime()->format('Y-m-d H:i:s') : null;
        $effectiveEndTs = $rel->getEffectiveEndTs() ? $rel->getEffectiveEndTs()->toDateTime()->format('Y-m-d H:i:s') : null;
        $createdTs = $rel->getCreatedTs() ? $rel->getCreatedTs()->toDateTime()->format('Y-m-d H:i:s') : null;
        $updatedTs = $rel->getUpdatedTs() ? $rel->getUpdatedTs()->toDateTime()->format('Y-m-d H:i:s') : null;
        $meter = MeterProtoConvertor::convertToArray($rel->getMeter());
        $noticeDate = $rel->getNoticeDate() ? $rel->getNoticeDate()->toDateTime()->format('Y-m-d') : null;
        $intimationDate = $rel->getIntimationDate() ? $rel->getIntimationDate()->toDateTime()->format('Y-m-d') : null;
        $changeDate = $rel->getChangeDate() ? $rel->getChangeDate()->toDateTime()->format('Y-m-d') : null;
        return [
            'version_id' => $rel->getVersionId(),
            'rel_id' => $rel->getRelId(),
            'meter_id' => $rel->getMeterId(),
            'connection_id' => $rel->getConnectionId(),
            'meter_use_category' => ParameterValueProtoConvertor::convertToArray($rel->getMeterUseCategory()),
            'meter_status' => ParameterValueProtoConvertor::convertToArray($rel->getMeterStatus()),
            'faulty_date' => $faultyDate,
            'rectification_date' => $rectificationDate,
            'sort_priority' => $rel->getSortPriority(),
            'is_meter_reading_mandatory' => $rel->getIsMeterReadingMandatory(),
            'change_reason' => ParameterValueProtoConvertor::convertToArray($rel->getChangeReason()),
            'effective_start_ts' => $effectiveStartTs,
            'effective_end_ts' => $effectiveEndTs,
            'is_active' => $rel->getIsActive(),
            'created_ts' => $createdTs,
            'updated_ts' => $updatedTs,
            'created_by' => $rel->getCreatedBy(),
            'updated_by' => $rel->getUpdatedBy(),
            'meter' => $meter,
            'notice_date' => $noticeDate,
            'intimation_date' => $intimationDate,
            'change_date' => $changeDate,
        ];
    }
}