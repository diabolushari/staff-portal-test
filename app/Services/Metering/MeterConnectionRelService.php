<?php

namespace App\Services\Metering;

use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
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
    private $client;

    public function __construct()
    {
        $this->client = new MeterConnectionRelServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createMeterConnectionRel(CreateMeterConnectionRelRequest $request): GrpcServiceResponse
    {
        [$response, $status] = $this->client->CreateMeterConnectionRel($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $meterConnectionRelArray = self::meterConnectionRelProtoToArray($response);

        return GrpcServiceResponse::success($meterConnectionRelArray, $response, $status->code, $status->details);
    }

    public function getMeterConnectionRel(int $relId): GrpcServiceResponse
    {
        $request = new GetMeterConnectionRelRequest;
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
        $meterConnectionRelArray = self::meterConnectionRelProtoToArray($response);

        return GrpcServiceResponse::success($meterConnectionRelArray, $response, $status->code, $status->details);
    }

    public function getMeterConnectionRelByConnectionId(int $connectionId): GrpcServiceResponse
    {
        $request = new GetMeterConnectionRelByConnectionIdRequest;
        $request->setConnectionId($connectionId);
        [$response, $status] = $this->client->GetMeterConnectionRelByConnectionId($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details,

            );
        }
        $meterConnectionRelArray = self::meterConnectionRelProtoToArray($response);

        return GrpcServiceResponse::success($meterConnectionRelArray, $response, $status->code, $status->details);
    }

    public function listMeterConnectionRels(): GrpcServiceResponse
    {
        $request = new ListMeterConnectionRelsRequest;
        [$response, $status] = $this->client->ListMeterConnectionRels($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $meterConnectionRelsArray = [];
        foreach ($response->getMeterConnectionRels() as $meterConnectionRel) {
            $meterConnectionRelsArray[] = self::meterConnectionRelProtoToArray($meterConnectionRel);
        }

        return GrpcServiceResponse::success($meterConnectionRelsArray, $response, $status->code, $status->details);
    }

    public function updateMeterConnectionRel(UpdateMeterConnectionRelRequest $request): GrpcServiceResponse
    {
        [$response, $status] = $this->client->UpdateMeterConnectionRel($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $meterConnectionRelArray = self::meterConnectionRelProtoToArray($response);

        return GrpcServiceResponse::success($meterConnectionRelArray, $response, $status->code, $status->details);
    }

    public function deleteMeterConnectionRel(int $relId): GrpcServiceResponse
    {
        $request = new DeleteMeterConnectionRelRequest;
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

    public static function meterConnectionRelProtoToArray(MeterConnectionRelResponse $response): array
    {
        return [
            'version_id' => $response->getVersionId(),
            'rel_id' => $response->getRelId(),
            'meter_id' => $response->getMeterId(),
            'connection_id' => $response->getConnectionId(),
            'meter_use_category' => self::transformParameterValueToArray($response->getMeterUseCategory()),
            'bidirectional_ind' => $response->getBidirectionalInd(),
            'meter_billing_mode' => $response->getMeterBillingMode(),
            'meter_status' => self::transformParameterValueToArray($response->getMeterStatus()),
            'faulty_date' => $response->hasFaultyDate() ? $response->getFaultyDate()->toDateTime()->format('Y-m-d H:i:s') : null,
            'rectification_date' => $response->hasRectificationDate() ? $response->getRectificationDate()->toDateTime()->format('Y-m-d H:i:s') : null,
            'change_reason' => self::transformParameterValueToArray($response->getChangeReason()),
            'effective_start_ts' => $response->getEffectiveStartTs()->toDateTime()->format('Y-m-d H:i:s'),
            'effective_end_ts' => $response->hasEffectiveEndTs() ? $response->getEffectiveEndTs()->toDateTime()->format('Y-m-d H:i:s') : null,
            'is_active' => $response->getIsActive(),
            'created_ts' => $response->getCreatedTs()->toDateTime()->format('Y-m-d H:i:s'),
            'updated_ts' => $response->hasUpdatedTs() ? $response->getUpdatedTs()->toDateTime()->format('Y-m-d H:i:s') : null,
            'created_by' => $response->getCreatedBy(),
            'updated_by' => $response->getUpdatedBy(),
        ];
    }

    private static function transformParameterValueToArray($parameterValue): ?array
    {
        if ($parameterValue === null) {
            return null;
        }

        // The structure is assumed based on usage in the provided controller context
        return [
            'id' => $parameterValue->getId(),
            'parameter_value' => $parameterValue->getParameterValue(),
        ];
    }
}
