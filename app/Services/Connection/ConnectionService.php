<?php

namespace App\Services\Connection;

use App\GrpcConverters\Connection\ConnectionProtoConverter;
use App\GrpcConverters\MeterProtoConvertor;
use App\Http\Requests\Connections\CreateConnectionFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\utils\GrpcServiceResponse;
use Google\Protobuf\Struct;
use Grpc\ChannelCredentials;
use Proto\Connections\ConnectionRequest;
use Proto\Connections\ConnectionServiceClient;
use Proto\Connections\ConnectionUpdateRequest;
use Proto\Connections\CreateConnectionRequest;
use Proto\Connections\GetConnectionRequest;
use Proto\Connections\ListConnectionsPaginatedRequest;
use Proto\Connections\ListConnectionsRequest;

class ConnectionService
{
    private ConnectionServiceClient $client;

    public function __construct(
        private readonly MeterConnectionMappingService $meterConnectionMappingService
    ) {
        $this->client = new ConnectionServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
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
            $connectionArray[] = ConnectionProtoConverter::convertToArray($connection);
        }

        return GrpcServiceResponse::success($connectionArray, $response, $status->code, $status->details);
    }

    public function listPaginatedConnections(?int $pageNumber = 1,
        ?int $pageSize = 10,
        ?string $consumerNumber = null,
        ?int $officeCode = null,
        ?int $connectionPurposeId = null,
        ?int $consumerTypeId = null): GrpcServiceResponse
    {
        $request = new ListConnectionsPaginatedRequest;

        if ($pageNumber) {
            $request->setPageNumber($pageNumber);
        }
        if ($pageSize) {
            $request->setPageSize($pageSize);
        }
        if ($consumerNumber) {
            $request->setConsumerNumber($consumerNumber);
        }
        if ($officeCode) {
            $request->setOfficeCode($officeCode);
        }
        if ($connectionPurposeId) {
            $request->setPrimaryPurposeId($connectionPurposeId);
        }
        if ($consumerTypeId) {
            $request->setConsumerTypeId($consumerTypeId);
        }

        [$response, $status] = $this->client->ListConnectionsPaginated($request)->wait();
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
            $connectionArray[] = ConnectionProtoConverter::convertToArray($connection);
        }
        $paginatedData = [
            'connections' => $connectionArray,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($paginatedData, $response, $status->code, $status->details);
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

        $result = ConnectionProtoConverter::convertToArray($response->getConnection());

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
        $meterRelations = $response->getMeters();
        $connectionArray = ConnectionProtoConverter::convertToArray($connection);
        $meters = [];
        foreach ($meterRelations as $meterRelation) {
            $priority = $meterRelation->getSortPriority();
            $meters[] = [
                'priority' => $priority,
                'meter' => MeterProtoConvertor::convertToArray($meterRelation->getMeter()),
                'relationship' => $this->meterConnectionMappingService->meterConnectionMappingProtoToArray($meterRelation),
            ];
        }
        $connectionArray['meters'] = $meters;

        return GrpcServiceResponse::success($connectionArray, $response, $status->code, $status->details);
    }

    public function updateConnection(CreateConnectionFormRequest $request, int $connectionId): GrpcServiceResponse
    {

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
        $connectionArray = ConnectionProtoConverter::convertToArray($connection);

        return GrpcServiceResponse::success($connectionArray, $response, $status->code, $status->details);
    }

    public function deleteConnection(int $connectionId): GrpcServiceResponse
    {
        $grpcRequest = new ConnectionRequest;
        $grpcRequest->setConnectionId($connectionId);

        [$response, $status] = $this->client->deleteConnection($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success($response, $response, $status->code, $status->details);
    }
}
