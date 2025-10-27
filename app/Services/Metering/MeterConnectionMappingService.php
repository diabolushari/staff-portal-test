<?php

namespace App\Services\Metering;

use App\Http\Requests\Metering\MeterConnectionRelFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use DateTime;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Metering\CreateMeterConnectionMappingRequest;
use Proto\Metering\DeleteMeterConnectionMappingRequest;
use Proto\Metering\GetMeterConnectionMappingByConnectionIdRequest;
use Proto\Metering\GetMeterConnectionMappingRequest;
use Proto\Metering\ListMeterConnectionMappingsRequest;
use Proto\Metering\MeterConnectionMappingResponse;
use Proto\Metering\MeterConnectionMappingServiceClient;
use Proto\Metering\UpdateMeterConnectionMappingRequest;

class MeterConnectionMappingService
{
    private MeterConnectionMappingServiceClient $client;

    private MeterService $meterService;

    public function __construct(MeterService $meterService)
    {
        $this->client = new MeterConnectionMappingServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
        $this->meterService = $meterService;
    }

    public function createMeterConnectionMapping(MeterConnectionRelFormRequest $data): GrpcServiceResponse
    {
        $request = new CreateMeterConnectionMappingRequest;
        $request->setMeterId($data->meterId);
        $request->setConnectionId($data->connectionId);
        $request->setMeterUseCategory($data->meterUseCategory);
        $request->setBidirectionalInd($data->bidirectionalInd);
        $request->setMeterStatusId($data->meterStatusId);
        $request->setChangeReason($data->changeReason);
        if (isset($data->sortPriority)) {
            $request->setSortPriority($data->sortPriority);
        }
        $request->setIsMeterReadingMandatory($data->isMeterReadingMandatory);

        $effectiveStartTs = new Timestamp;
        $request->setEffectiveStartTs($effectiveStartTs);

        if (isset($data->meterBillingMode)) {
            $request->setMeterBillingMode($data->meterBillingMode);
        }
        if (isset($data->faultyDate)) {
            $faultyDate = new Timestamp;
            $faultyDate->fromDateTime(new DateTime($data->faultyDate));
            $request->setFaultyDate($faultyDate);
        }
        if (isset($data->rectificationDate)) {
            $rectificationDate = new Timestamp;
            $rectificationDate->fromDateTime(new DateTime($data->rectificationDate));
            $request->setRectificationDate($rectificationDate);
        }
        if (isset($data->effectiveEndTs)) {
            $effectiveEndTs = new Timestamp;
            $effectiveEndTs->fromDateTime(new DateTime($data->effectiveEndTs));
            $request->setEffectiveEndTs($effectiveEndTs);
        }
        if (isset($data->isActive)) {
            $request->setIsActive($data->isActive);
        }
        if (isset($data->createdBy)) {
            $request->setCreatedBy($data->createdBy);
        }

        [$response, $status] = $this->client->CreateMeterConnectionMapping($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionMappingProtoToArray($response), $response, $status->code, $status->details);
    }

    public function getMeterConnectionMapping(int $relId): GrpcServiceResponse
    {
        $request = new GetMeterConnectionMappingRequest;
        $request->setRelId($relId);

        [$response, $status] = $this->client->GetMeterConnectionMapping($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionMappingProtoToArray($response), $response, $status->code, $status->details);
    }

    public function getMeterConnectionMappingByConnectionId(int $connectionId): GrpcServiceResponse
    {
        $request = new GetMeterConnectionMappingByConnectionIdRequest;
        $request->setConnectionId($connectionId);

        [$response, $status] = $this->client->GetMeterConnectionMappingByConnectionId($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details,
            );
        }

        // Expecting a repeated field: meter_connection_mappings
        $items = [];
        foreach ($response->getMeterConnectionMappings() as $mapping) {
            $items[] = self::meterConnectionMappingProtoToArray($mapping);
        }

        return GrpcServiceResponse::success($items, $response, $status->code, $status->details);
    }

    public function listMeterConnectionMappings(): GrpcServiceResponse
    {
        $request = new ListMeterConnectionMappingsRequest;

        [$response, $status] = $this->client->ListMeterConnectionMappings($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $relsArray = [];
        foreach ($response->getMeterConnectionMappings() as $rel) {
            $relsArray[] = self::meterConnectionMappingProtoToArray($rel);
        }

        return GrpcServiceResponse::success($relsArray, $response, $status->code, $status->details);
    }

    public function updateMeterConnectionMapping(MeterConnectionRelFormRequest $data): GrpcServiceResponse
    {
        $request = new UpdateMeterConnectionMappingRequest;
        if (isset($data->relId)) {
            $request->setRelId($data->relId);
        }
        $request->setMeterId($data->meterId);
        $request->setConnectionId($data->connectionId);
        $request->setMeterUseCategory($data->meterUseCategory);
        $request->setBidirectionalInd($data->bidirectionalInd);
        $request->setMeterStatusId($data->meterStatusId);
        $request->setChangeReason($data->changeReason);

        if (isset($data->sortPriority)) {
            $request->setSortPriority($data->sortPriority);
        }
        $request->setIsMeterReadingMandatory($data->isMeterReadingMandatory);

        if (isset($data->effectiveStartTs)) {
            $effectiveStartTs = new Timestamp;
            $effectiveStartTs->fromDateTime(new DateTime($data->effectiveStartTs));
            $request->setEffectiveStartTs($effectiveStartTs);
        }

        if (isset($data->meterBillingMode)) {
            $request->setMeterBillingMode($data->meterBillingMode);
        }
        if (isset($data->faultyDate)) {
            $faultyDate = new Timestamp;
            $faultyDate->fromDateTime(new DateTime($data->faultyDate));
            $request->setFaultyDate($faultyDate);
        }
        if (isset($data->rectificationDate)) {
            $rectificationDate = new Timestamp;
            $rectificationDate->fromDateTime(new DateTime($data->rectificationDate));
            $request->setRectificationDate($rectificationDate);
        }
        if (isset($data->effectiveEndTs)) {
            $effectiveEndTs = new Timestamp;
            $effectiveEndTs->fromDateTime(new DateTime($data->effectiveEndTs));
            $request->setEffectiveEndTs($effectiveEndTs);
        }
        if (isset($data->isActive)) {
            $request->setIsActive($data->isActive);
        }
        if (isset($data->updatedBy)) {
            $request->setUpdatedBy($data->updatedBy);
        }

        [$response, $status] = $this->client->UpdateMeterConnectionMapping($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionMappingProtoToArray($response), $response, $status->code, $status->details);
    }

    public function deleteMeterConnectionMapping(int $relId): GrpcServiceResponse
    {
        $request = new DeleteMeterConnectionMappingRequest;
        $request->setRelId($relId);

        [$response, $status] = $this->client->DeleteMeterConnectionMapping($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
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
        $meter = $this->meterService->meterProtoToArray($rel->getMeter());

        return [
            'version_id' => $rel->getVersionId(),
            'rel_id' => $rel->getRelId(),
            'meter_id' => $rel->getMeterId(),
            'connection_id' => $rel->getConnectionId(),
            'meter_use_category' => self::transformParameterValueToArray($rel->getMeterUseCategory()),
            'bidirectional_ind' => $rel->getBidirectionalInd(),
            'meter_billing_mode' => $rel->getMeterBillingMode(),
            'meter_status' => self::transformParameterValueToArray($rel->getMeterStatus()),
            'faulty_date' => $faultyDate,
            'rectification_date' => $rectificationDate,
            'sort_priority' => $rel->getSortPriority(),
            'is_meter_reading_mandatory' => $rel->getIsMeterReadingMandatory(),
            'change_reason' => self::transformParameterValueToArray($rel->getChangeReason()),
            'effective_start_ts' => $effectiveStartTs,
            'effective_end_ts' => $effectiveEndTs,
            'is_active' => $rel->getIsActive(),
            'created_ts' => $createdTs,
            'updated_ts' => $updatedTs,
            'created_by' => $rel->getCreatedBy(),
            'updated_by' => $rel->getUpdatedBy(),
            'meter' => $meter,
        ];
    }

    private static function transformParameterValueToArray($parameterValue): ?array
    {
        if ($parameterValue === null) {
            return null;
        }

        return [
            'id' => $parameterValue->getId(),
            'parameter_value' => $parameterValue->getParameterValue(),
        ];
    }
}
