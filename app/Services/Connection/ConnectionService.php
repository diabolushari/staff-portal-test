<?php

namespace App\Services\Connection;

use App\Http\Requests\Connections\CreateConnectionFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Carbon\Carbon;
use Google\Protobuf\Struct;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Connections\ConnectionMessage;
use Proto\Connections\ConnectionServiceClient;
use Proto\Connections\ConnectionUpdateRequest;
use Proto\Connections\CreateConnectionRequest;
use Proto\Connections\GetConnectionRequest;
use Proto\Connections\ListConnectionsRequest;

class ConnectionService
{
    private ConnectionServiceClient $client;

    private ParameterValueService $parameterValueService;

    public function __construct(ParameterValueService $parameterValueService)
    {
        $this->client = new ConnectionServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
        $this->parameterValueService = $parameterValueService;
    }

    public function listConnections(?string $consumerNumber): GrpcServiceResponse
    {
        $request = new ListConnectionsRequest;

        $request->setPage(1);
        $request->setPageSize(10);
        if ($consumerNumber) {
            $request->setConsumerNumber($consumerNumber);
        }

        [$response, $status] = $this->client->ListConnections($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $connections = $response->getItems();
        $connectionArray = [];
        foreach ($connections as $connection) {
            $connectionArray[] = $this->transformConnectionToArray($connection);
        }

        return GrpcServiceResponse::success($connectionArray, $response, $status->code, $status->details);
    }

    public function createConnection(CreateConnectionFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = new CreateConnectionRequest;
        $grpcRequest->setConnectionTypeId($request->connectionTypeId);
        $grpcRequest->setConnectionStatusId($request->connectionStatusId);
        $grpcRequest->setConnectedDate($request->connectedDate);
        $grpcRequest->setServiceOfficeCode($request->serviceOfficeCode);
        $grpcRequest->setAdminOfficeCode($request->adminOfficeCode);
        $grpcRequest->setVoltageId($request->voltageTypeId);
        $grpcRequest->setContractDemandKvaVal($request->contractDemandKwVal);
        $grpcRequest->setConnectedLoadKwVal($request->connectedLoadKwVal);
        $grpcRequest->setTariffId($request->tariffTypeId);
        $grpcRequest->setPrimaryPurposeId($request->primaryPurposeId);
        $grpcRequest->setConnectionCategoryId($request->connectionCategoryId);
        $grpcRequest->setConnectionSubcategoryId($request->connectionSubcategoryId);
        $connectionAttribs = new Struct;
        $connectionAttribs->setFields($request->connectionAttribs ?? []);
        $grpcRequest->setConnectionAttribs($connectionAttribs);
        $purposesInfo = new Struct;
        $purposesInfo->setFields($request->purposesInfo ?? []);
        $grpcRequest->setPurposesInfo($purposesInfo);
        $grpcRequest->setBillingProcessId($request->billingProcessId);
        $grpcRequest->setSolarIndicator($request->solarIndicator);
        $grpcRequest->setOpenAccessTypeId($request->openAccessTypeId ?? 0);
        $grpcRequest->setMeteringTypeId($request->meteringTypeId ?? 0);
        $grpcRequest->setRenewableTypeId($request->renewableTypeId ?? 0);
        $grpcRequest->setMultiSourceIndicator($request->multiSourceIndicator);
        $grpcRequest->setLiveIndicator($request->liveIndicator);
        $grpcRequest->setPhaseTypeId($request->phaseTypeId);
        $grpcRequest->setConsumerLegacyCode($request->consumerLegacyCode ?? '');
        $grpcRequest->setPowerLoadKwVal($request->powerLoadKwVal);
        $grpcRequest->setLightLoadKwVal($request->lightLoadKwVal);
        $grpcRequest->setOtherconsFlag($request->otherconsFlag);
        $grpcRequest->setCppFlag($request->cppFlag);

        [$response, $status] = $this->client->CreateConnection($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $result = $this->transformConnectionToArray($response->getConnection());

        return GrpcServiceResponse::success($result, $response, $status->code, $status->details);
    }

    public function getConnection(int $id): GrpcServiceResponse
    {
        $request = new GetConnectionRequest;
        $request->setConnectionId($id);
        [$response, $status] = $this->client->GetConnection($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $connection = $response->getConnection();
        $connectionArray = $this->transformConnectionToArray($connection);

        return GrpcServiceResponse::success($connectionArray, $response, $status->code, $status->details);
    }

    public function updateConnection(CreateConnectionFormRequest $request, int $connectionId): GrpcServiceResponse
    {

        // Wrap into UpdateConnectionRequest
        $grpcRequest = new ConnectionUpdateRequest;
        $grpcRequest->setConnectionId($connectionId);
        $grpcRequest->setConnectionStatusId($request->connectionStatusId);
        $grpcRequest->setConnectedDate($request->connectedDate);
        $grpcRequest->setAdminOfficeCode($request->adminOfficeCode);
        $grpcRequest->setVoltageId($request->voltageTypeId);
        $grpcRequest->setContractDemandKvaVal($request->contractDemandKwVal);
        $grpcRequest->setConnectedLoadKwVal($request->connectedLoadKwVal);
        $grpcRequest->setTariffId($request->tariffTypeId);
        $grpcRequest->setPrimaryPurposeId($request->primaryPurposeId);
        $grpcRequest->setConnectionCategoryId($request->connectionCategoryId);
        $grpcRequest->setConnectionSubcategoryId($request->connectionSubcategoryId);
        $connectionAttribs = new Struct;
        $connectionAttribs->setFields($request->connectionAttribs ?? []);
        $grpcRequest->setConnectionAttribs($connectionAttribs);
        $purposesInfo = new Struct;
        $purposesInfo->setFields($request->purposesInfo ?? []);
        $grpcRequest->setPurposesInfo($purposesInfo);
        $grpcRequest->setBillingProcessId($request->billingProcessId);
        $grpcRequest->setSolarIndicator($request->solarIndicator);
        $grpcRequest->setOpenAccessTypeId($request->openAccessTypeId ?? 0);
        $grpcRequest->setMeteringTypeId($request->meteringTypeId ?? 0);
        $grpcRequest->setRenewableTypeId($request->renewableTypeId ?? 0);
        $grpcRequest->setMultiSourceIndicator($request->multiSourceIndicator);
        $grpcRequest->setPhaseTypeId($request->phaseTypeId);
        $grpcRequest->setLiveIndicator($request->liveIndicator);
        $grpcRequest->setConsumerLegacyCode($request->consumerLegacyCode ?? '');
        $grpcRequest->setPowerLoadKwVal($request->powerLoadKwVal);
        $grpcRequest->setLightLoadKwVal($request->lightLoadKwVal);
        $grpcRequest->setOtherconsFlag($request->otherconsFlag);
        $grpcRequest->setCppFlag($request->cppFlag);

        [$response, $status] = $this->client->UpdateConnection($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $connection = $response->getConnection();
        $connectionArray = $this->transformConnectionToArray($connection);

        return GrpcServiceResponse::success($connectionArray, $response, $status->code, $status->details);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformConnectionToArray(ConnectionMessage $connection): array
    {

        return [
            'version_id' => $connection->getVersionId(),
            'connection_id' => $connection->getConnectionId(),
            'consumer_legacy_code' => $connection->getConsumerLegacyCode(),
            'connection_type_id' => $connection->getConnectionTypeId(),
            'consumer_number' => $connection->getConsumerNum(),
            'connection_status_id' => $connection->getConnectionStatusId(),
            'connected_date' => $connection->getConnectedDate(),
            'service_office_code' => $connection->getServiceOfficeCode(),
            'admin_office_code' => $connection->getAdminOfficeCode(),
            'voltage_id' => $connection->getVoltageId(),
            'contract_demand_kw_val' => $connection->getContractDemandKvaVal(),
            'connected_load_kw_val' => $connection->getConnectedLoadKwVal(),
            'tariff_id' => $connection->getTariffId(),
            'primary_purpose_id' => $connection->getPrimaryPurposeId(),
            'connection_category_id' => $connection->getConnectionCategoryId(),
            'connection_subcategory_id' => $connection->getConnectionSubcategoryId(),
            'billing_process_id' => $connection->getBillingProcessId(),
            'phase_type_id' => $connection->getPhaseTypeId(),
            'solar_indicator' => $connection->getSolarIndicator(),
            'open_access_type_id' => $connection->getOpenAccessTypeId(),
            'metering_type_id' => $connection->getMeteringTypeId(),
            'renewable_type_id' => $connection->getRenewableTypeId(),
            'multi_source_indicator' => $connection->getMultiSourceIndicator(),
            'live_indicator' => $connection->getLiveIndicator(),
            'is_current' => $connection->getIsCurrent(),
            'created_by' => $connection->getCreatedBy(),
            'updated_by' => $connection->getUpdatedBy(),
            'effective_start' => $this->convertFromTimestamp($connection->getEffectiveStart()),
            'effective_end' => $this->convertFromTimestamp($connection->getEffectiveEnd()),
            'created_at' => $this->convertFromTimestamp($connection->getCreatedAt()),
            'updated_at' => $this->convertFromTimestamp($connection->getUpdatedAt()),
            'power_load_kw_val' => $connection->getPowerLoadKwVal(),
            'light_load_kw_val' => $connection->getLightLoadKwVal(),
            'othercons_flag' => $connection->getOtherconsFlag(),
            'cpp_flag' => $connection->getCppFlag(),
            'connection_attribs' => $connection->getConnectionAttribs() ? json_decode($connection->getConnectionAttribs()->serializeToJsonString(), true) : null,
            'purposes_info' => $connection->getPurposesInfo() ? json_decode($connection->getPurposesInfo()->serializeToJsonString(), true) : null,
            'connected_load_info' => $connection->getConnectedLoadInfo() ? json_decode($connection->getConnectedLoadInfo()->serializeToJsonString(), true) : null,
            'multi_source_info' => $connection->getMultiSourceInfo() ? json_decode($connection->getMultiSourceInfo()->serializeToJsonString(), true) : null,
            'consumer_type' => $this->parameterValueService->toArray($connection->getConsumerType()),
            'connection_type' => $this->parameterValueService->toArray($connection->getConnectionType()),
            'connection_status' => $this->parameterValueService->toArray($connection->getConnectionStatus()),
            'open_access_type' => $this->parameterValueService->toArray($connection->getOpenAccessType()),
            'metering_type' => $this->parameterValueService->toArray($connection->getMeteringType()),
            'renewable_type' => $this->parameterValueService->toArray($connection->getRenewableType()),
            'phase_type' => $this->parameterValueService->toArray($connection->getPhaseType()),
            'voltage' => $this->parameterValueService->toArray($connection->getVoltage()),
            'connection_category' => $this->parameterValueService->toArray($connection->getConnectionCategory()),
            'connection_subcategory' => $this->parameterValueService->toArray($connection->getConnectionSubcategory()),
            'primary_purpose' => $this->parameterValueService->toArray($connection->getPrimaryPurpose()),
            'billing_process' => $this->parameterValueService->toArray($connection->getBillingProcess()),
            'tariff' => $this->parameterValueService->toArray($connection->getTariff()),
        ];
    }

    /**
     * Convert protobuf Timestamp to a Carbon ISO string.
     */
    private function convertFromTimestamp(?Timestamp $timestamp): ?string
    {
        if ($timestamp === null) {
            return null;
        }

        $seconds = $timestamp->getSeconds();
        $nanos = $timestamp->getNanos();

        if ($seconds === 0 && $nanos === 0) {
            return null;
        }

        $carbon = Carbon::createFromTimestamp($seconds);
        $carbon->addMicroseconds(intval($nanos / 1000));

        return $carbon->toISOString();
    }
}
