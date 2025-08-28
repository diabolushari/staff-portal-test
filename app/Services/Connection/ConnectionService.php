<?php

namespace App\Services\Connection;

use App\Http\Requests\Connections\CreateConnectionRequest;
use App\Http\Requests\Connections\CreateConnectionWithConsumerRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Carbon\Carbon;
use Google\Protobuf\Struct;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Consumers\ConnectionServiceClient;
use Proto\Consumers\CreateConnectionRequest as ConsumersCreateConnectionRequest;
// Alias the gRPC request message to avoid naming conflicts
use Proto\Consumers\CreateConnectionWithConsumerRequest as GrpcCreateRequest;
use Proto\Consumers\GetConnectionRequest;
use Proto\Consumers\ListConnectionsRequest;

class ConnectionService
{
    private ConnectionServiceClient $client;

    public function __construct()
    {
        $this->client = new ConnectionServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listConnections(): GrpcServiceResponse
    {
        $request = new ListConnectionsRequest();

        $request->setPage(1);
        $request->setPageSize(10);

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

    public function createConnection(CreateConnectionRequest $request): GrpcServiceResponse
    {
        $grpcRequest = new ConsumersCreateConnectionRequest();
        $grpcRequest->setConnectionTypeId($request->connectionTypeId);
        $grpcRequest->setConsumerNum($request->consumerNumber);
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
        $connectionAttribs = new Struct();
        $connectionAttribs->setFields($request->connectionAttribs ?? []);
        $grpcRequest->setConnectionAttribs($connectionAttribs);
        $purposesInfo = new Struct();
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

        [$response, $status] = $this->client->CreateConnection($grpcRequest)->wait();


        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $result = [
            'connection' => $this->transformConnectionToArray($response->getConnection()),
        ];

        return GrpcServiceResponse::success($result, $response, $status->code, $status->details);
    }


    public function createConnectionWithConsumer(CreateConnectionWithConsumerRequest $request): GrpcServiceResponse
    {
        $grpcRequest = new GrpcCreateRequest;

        // Populate the nested messages using the data from the DTOs.
        // The spatie/laravel-data `toArray()` method simplifies this significantly.
        $grpcRequest->setConnection($request->connection->toArray());
        $grpcRequest->setConsumerProfile($request->consumerProfile->toArray());

        [$response, $status] = $this->client->CreateConnectionWithConsumer($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        // Transform the response from protobuf messages to arrays
        $result = [
            'connection' => $this->transformConnectionToArray($response->getConnection()),
            'consumer_profile' => $this->transformConsumerProfileToArray($response->getConsumerProfile()),
        ];

        return GrpcServiceResponse::success($result, $response, $status->code, $status->details);
    }

    public function getConnection(int $id): GrpcServiceResponse
    {
        $request = new GetConnectionRequest();
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

    /**
     * Transform ConnectionMessage protobuf to PHP array.
     */
    private function transformConnectionToArray($connection): array
    {
        $parameterValueService = app(ParameterValueService::class);
        return [
            'version_id' => $connection->getVersionId(),
            'connection_id' => $connection->getConnectionId(),
            'connection_type_id' => $connection->getConnectionTypeId(),
            'consumer_num' => $connection->getConsumerNum(),
            'connection_status_id' => $connection->getConnectionStatusId(),
            'connected_date' => $connection->getConnectedDate(),
            'service_office_code' => $connection->getServiceOfficeCode(),
            'admin_office_code' => $connection->getAdminOfficeCode(),
            'voltage_id' => $connection->getVoltageId(),
            'contract_demand_kva_val' => $connection->getContractDemandKvaVal(),
            'connected_load_kw_val' => $connection->getConnectedLoadKwVal(),
            'tariff_id' => $connection->getTariffId(),
            'primary_purpose_id' => $connection->getPrimaryPurposeId(),
            'connection_category_id' => $connection->getConnectionCategoryId(),
            'connection_subcategory_id' => $connection->getConnectionSubcategoryId(),
            'billing_process_id' => $connection->getBillingProcessId(),
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
            // Structs are converted from JSON string to array
            'connection_attribs' => json_decode($connection->getConnectionAttribs()?->serializeToJsonString(), true),
            'purposes_info' => json_decode($connection->getPurposesInfo()?->serializeToJsonString(), true),
            'connected_load_info' => json_decode($connection->getConnectedLoadInfo()?->serializeToJsonString(), true),
            'multi_source_info' => json_decode($connection->getMultiSourceInfo()?->serializeToJsonString(), true),
            'consumer_type' => $parameterValueService->toArray($connection->getConsumerType()),
            'connection_type' => $parameterValueService->toArray($connection->getConnectionType()),
            'connection_status' => $parameterValueService->toArray($connection->getConnectionStatus()),
            'open_access_type' => $parameterValueService->toArray($connection->getOpenAccessType()),
            'metering_type' => $parameterValueService->toArray($connection->getMeteringType()),
            'renewable_type' => $parameterValueService->toArray($connection->getRenewableType()),
            'phase_type' => $parameterValueService->toArray($connection->getPhaseType()),
            'voltage' => $parameterValueService->toArray($connection->getVoltage()),
        ];
    }

    /**
     * Transform ConsumerProfileMessage protobuf to PHP array.
     */
    private function transformConsumerProfileToArray($profile): array
    {
        return [
            'version_id' => $profile->getVersionId(),
            'connection_id' => $profile->getConnectionId(),
            'consumer_type_id' => $profile->getConsumerTypeId(),
            'organisation_name' => $profile->getOrganisationName(),
            'applicant_code' => $profile->getApplicantCode(),
            'consumer_pan' => $profile->getConsumerPan(),
            'consumer_tan' => $profile->getConsumerTan(),
            'consumer_cin' => $profile->getConsumerCin(),
            'consumer_gstin' => $profile->getConsumerGstin(),
            'income_tax_withholding_ind' => $profile->getIncomeTaxWithholdingInd(),
            'gst_withholding_ind' => $profile->getGstWithholdingInd(),
            'seasonal_ind' => $profile->getSeasonalInd(),
            'license_ind' => $profile->getLicenseInd(),
            'open_access_ind' => $profile->getOpenAccessInd(),
            'is_current' => $profile->getIsCurrent(),
            'created_by' => $profile->getCreatedBy(),
            'updated_by' => $profile->getUpdatedBy(),
            'effective_start' => $this->convertFromTimestamp($profile->getEffectiveStart()),
            'effective_end' => $this->convertFromTimestamp($profile->getEffectiveEnd()),
            'created_at' => $this->convertFromTimestamp($profile->getCreatedAt()),
            'updated_at' => $this->convertFromTimestamp($profile->getUpdatedAt()),
            // Structs are converted from JSON string to array
            'manufacturing_info' => json_decode($profile->getManufacturingInfo()?->serializeToJsonString(), true),
            'tax_info' => json_decode($profile->getTaxInfo()?->serializeToJsonString(), true),
            'identity_info' => json_decode($profile->getIdentityInfo()?->serializeToJsonString(), true),
            'application_info' => json_decode($profile->getApplicationInfo()?->serializeToJsonString(), true),
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
