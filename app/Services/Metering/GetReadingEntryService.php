<?php

namespace App\Services\Metering;

use App\GrpcConverters\Connection\ConnectionProtoConverter;
use App\GrpcConverters\Connection\MeterConnectionMappingConverter;
use App\GrpcConverters\Meter\MeterProtoConvertor;
use App\GrpcConverters\Metering\MeterReadingConverter;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\MeterReading\GetReadingEntryDataRequest;
use Proto\MeterReading\GetReadingEntryDataResponse;
use Proto\MeterReading\ReadingEntryDataServiceClient;

class GetReadingEntryService
{
    private ReadingEntryDataServiceClient $client;

    public function __construct(
        private MeterReadingValueService $meterReadingValueService
    ) {
        $this->client = new ReadingEntryDataServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function getReadingEntryData(
        int $connectionId,
        ?string $readingStartDate = null,
        ?string $readingEndDate = null
    ): GrpcServiceResponse {
        $protoRequest = new GetReadingEntryDataRequest();
        $protoRequest->setConnectionId($connectionId);
        if ($readingStartDate) {
            $protoRequest->setReadingStartDate($readingStartDate);
        }
        if ($readingEndDate) {
            $protoRequest->setReadingEndDate($readingEndDate);
        }
        [$response, $status] = $this->client->GetReadingEntryData($protoRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $meterReadingsArray = [];

        $meterReadingsArray = $this->convertToMeterReadingData($response);


        return GrpcServiceResponse::success($meterReadingsArray, $response, $status->code, $status->details);
    }

    public function convertToMeterReadingData(GetReadingEntryDataResponse $response): array
    {
        $connections = $response->getConnection();
        $connectionsArray = [];
        foreach ($connections as $connection) {
            $connectionArray = ConnectionProtoConverter::convertToArray($connection);
            $connectionsArray[] = $connectionArray;
        }
        $meterReadingValueGroups = $response->getMeterReadingValueGroups();
        $meterReadingValueGroupsArray = [];
        foreach ($meterReadingValueGroups as $meterReadingValueGroup) {
            $values = [];
            foreach ($meterReadingValueGroup->getValues() as $value) {
                $value = $this->meterReadingValueService->valueMessageToArray($value);
                $values[] = $value;
            }
            $meter = $meterReadingValueGroup->getMeter();
            $meterArray = MeterProtoConvertor::convertToArray($meter);
            $reading = MeterReadingConverter::toArray($meterReadingValueGroup->getReading());
            $meterReadingValueGroupArray = [
                'values' => $values,
                'meter' => $meterArray,
                'reading' => $reading,
            ];
            $meterReadingValueGroupsArray[] = $meterReadingValueGroupArray;
        }
        $meterConnectionMappings = $response->getMeterConnectionMappings();
        $meterConnectionMappingsArray = [];
        foreach ($meterConnectionMappings as $meterConnectionMapping) {
            $meterConnectionMappingsArray[] = MeterConnectionMappingConverter::meterConnectionMappingProtoToArray($meterConnectionMapping);
        }
        return [
            'connections' => $connectionsArray,
            'meter_reading_value_groups' => $meterReadingValueGroupsArray,
            'meter_connection_mappings' => $meterConnectionMappingsArray,
        ];
    }
}
