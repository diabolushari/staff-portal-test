<?php

namespace App\Services\Connection;

use App\Http\Requests\Connections\CreateConnectionWithConsumerRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Carbon\Carbon;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Consumers\ConnectionServiceClient;
// Alias the gRPC request message to avoid naming conflicts
use Proto\Consumers\CreateConnectionWithConsumerRequest as GrpcCreateRequest;
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



        // Transform the response from protobuf messages to arrays
        $result = collect($response->getConnections())
            ->map(fn($item) => $this->transformConnectionToArray($item))
            ->toArray();

        return GrpcServiceResponse::success($result, $response, $status->code, $status->details);
    }

    /**
     * Create a new connection with a consumer profile.
     */
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

    /**
     * Transform ConnectionMessage protobuf to PHP array.
     */
    private function transformConnectionToArray($connection): array
    {
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
