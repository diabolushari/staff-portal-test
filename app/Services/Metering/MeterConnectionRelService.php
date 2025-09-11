<?php

namespace App\Services\Metering;

use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Metering\CreateMeterConnectionRelRequest;
use Proto\Metering\DeleteMeterConnectionRelRequest;
use Proto\Metering\GetMeterConnectionRelByConnectionIdRequest;
use Proto\Metering\GetMeterConnectionRelRequest;
use Proto\Metering\ListMeterConnectionRelsRequest;
use Proto\Metering\MeterConnectionRelResponse;
use Proto\Metering\MeterConnectionRelServiceClient;
use Proto\Metering\UpdateMeterConnectionRelRequest;

class MeterConnectionRelService
{
    private MeterConnectionRelServiceClient $client;

    public function __construct()
    {
        $this->client = new MeterConnectionRelServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createMeterConnectionRel(array $data): GrpcServiceResponse
    {
        $request = new CreateMeterConnectionRelRequest();
        $request->setMeterId($data['meter_id']);
        $request->setConnectionId($data['connection_id']);
        $request->setMeterUseCategory($data['meter_use_category']);
        $request->setBidirectionalInd($data['bidirectional_ind']);
        $request->setMeterStatusId($data['meter_status_id']);
        $request->setChangeReason($data['change_reason']);

        $effectiveStartTs = new Timestamp();
        $effectiveStartTs->fromDateTime(new \DateTime($data['effective_start_ts']));
        $request->setEffectiveStartTs($effectiveStartTs);

        if (isset($data['meter_billing_mode'])) {
            $request->setMeterBillingMode($data['meter_billing_mode']);
        }
        if (isset($data['faulty_date'])) {
            $faultyDate = new Timestamp();
            $faultyDate->fromDateTime(new \DateTime($data['faulty_date']));
            $request->setFaultyDate($faultyDate);
        }
        if (isset($data['rectification_date'])) {
            $rectificationDate = new Timestamp();
            $rectificationDate->fromDateTime(new \DateTime($data['rectification_date']));
            $request->setRectificationDate($rectificationDate);
        }
        if (isset($data['effective_end_ts'])) {
            $effectiveEndTs = new Timestamp();
            $effectiveEndTs->fromDateTime(new \DateTime($data['effective_end_ts']));
            $request->setEffectiveEndTs($effectiveEndTs);
        }
        if (isset($data['is_active'])) {
            $request->setIsActive($data['is_active']);
        }
        if (isset($data['created_by'])) {
            $request->setCreatedBy($data['created_by']);
        }

        [$response, $status] = $this->client->CreateMeterConnectionRel($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionRelProtoToArray($response), $response, $status->code, $status->details);
    }

    public function getMeterConnectionRel(int $relId): GrpcServiceResponse
    {
        $request = new GetMeterConnectionRelRequest();
        $request->setRelId($relId);

        [$response, $status] = $this->client->GetMeterConnectionRel($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionRelProtoToArray($response), $response, $status->code, $status->details);
    }

    public function getMeterConnectionRelByConnectionId(int $connectionId): GrpcServiceResponse
    {
        $request = new GetMeterConnectionRelByConnectionIdRequest();
        $request->setConnectionId($connectionId);

        [$response, $status] = $this->client->GetMeterConnectionRelByConnectionId($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionRelProtoToArray($response), $response, $status->code, $status->details);
    }

    public function listMeterConnectionRels(): GrpcServiceResponse
    {
        $request = new ListMeterConnectionRelsRequest();

        [$response, $status] = $this->client->ListMeterConnectionRels($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $relsArray = [];
        foreach ($response->getMeterConnectionRels() as $rel) {
            $relsArray[] = self::meterConnectionRelProtoToArray($rel);
        }

        return GrpcServiceResponse::success($relsArray, $response, $status->code, $status->details);
    }

    public function updateMeterConnectionRel(array $data): GrpcServiceResponse
    {
        $request = new UpdateMeterConnectionRelRequest();
        $request->setRelId($data['rel_id']);
        $request->setMeterId($data['meter_id']);
        $request->setConnectionId($data['connection_id']);
        $request->setMeterUseCategory($data['meter_use_category']);
        $request->setBidirectionalInd($data['bidirectional_ind']);
        $request->setMeterStatusId($data['meter_status_id']);
        $request->setChangeReason($data['change_reason']);

        $effectiveStartTs = new Timestamp();
        $effectiveStartTs->fromDateTime(new \DateTime($data['effective_start_ts']));
        $request->setEffectiveStartTs($effectiveStartTs);

        if (isset($data['meter_billing_mode'])) {
            $request->setMeterBillingMode($data['meter_billing_mode']);
        }
        if (isset($data['faulty_date'])) {
            $faultyDate = new Timestamp();
            $faultyDate->fromDateTime(new \DateTime($data['faulty_date']));
            $request->setFaultyDate($faultyDate);
        }
        if (isset($data['rectification_date'])) {
            $rectificationDate = new Timestamp();
            $rectificationDate->fromDateTime(new \DateTime($data['rectification_date']));
            $request->setRectificationDate($rectificationDate);
        }
        if (isset($data['effective_end_ts'])) {
            $effectiveEndTs = new Timestamp();
            $effectiveEndTs->fromDateTime(new \DateTime($data['effective_end_ts']));
            $request->setEffectiveEndTs($effectiveEndTs);
        }
        if (isset($data['is_active'])) {
            $request->setIsActive($data['is_active']);
        }
        if (isset($data['updated_by'])) {
            $request->setUpdatedBy($data['updated_by']);
        }

        [$response, $status] = $this->client->UpdateMeterConnectionRel($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterConnectionRelProtoToArray($response), $response, $status->code, $status->details);
    }

    public function deleteMeterConnectionRel(int $relId): GrpcServiceResponse
    {
        $request = new DeleteMeterConnectionRelRequest();
        $request->setRelId($relId);

        [$response, $status] = $this->client->DeleteMeterConnectionRel($request)->wait();

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

    public static function meterConnectionRelProtoToArray(MeterConnectionRelResponse $rel): array
    {
        $faultyDate = $rel->getFaultyDate() ? $rel->getFaultyDate()->toDateTime()->format('Y-m-d') : null;
        $rectificationDate = $rel->getRectificationDate() ? $rel->getRectificationDate()->toDateTime()->format('Y-m-d') : null;
        $effectiveStartTs = $rel->getEffectiveStartTs() ? $rel->getEffectiveStartTs()->toDateTime()->format('Y-m-d H:i:s') : null;
        $effectiveEndTs = $rel->getEffectiveEndTs() ? $rel->getEffectiveEndTs()->toDateTime()->format('Y-m-d H:i:s') : null;
        $createdTs = $rel->getCreatedTs() ? $rel->getCreatedTs()->toDateTime()->format('Y-m-d H:i:s') : null;
        $updatedTs = $rel->getUpdatedTs() ? $rel->getUpdatedTs()->toDateTime()->format('Y-m-d H:i:s') : null;

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
            'change_reason' => self::transformParameterValueToArray($rel->getChangeReason()),
            'effective_start_ts' => $effectiveStartTs,
            'effective_end_ts' => $effectiveEndTs,
            'is_active' => $rel->getIsActive(),
            'created_ts' => $createdTs,
            'updated_ts' => $updatedTs,
            'created_by' => $rel->getCreatedBy(),
            'updated_by' => $rel->getUpdatedBy(),
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
