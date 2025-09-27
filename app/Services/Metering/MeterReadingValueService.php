<?php

namespace App\Services\Metering;

use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\MeterReading\GetMeterReadingValuesRequest;
use Proto\MeterReading\GetMeterReadingValuesResponse;
use Proto\MeterReading\ListMeterReadingValuesRequest;
use Proto\MeterReading\MeterReadingValuesMessage;
use Proto\MeterReading\MeterReadingValuesServiceClient;

class MeterReadingValueService
{
    private MeterReadingValuesServiceClient $client;

    public function __construct(
        private ParameterValueService $parameterValueService,
        private MeteringParameterProfileService $meteringParameterProfileService,
    ) {
        $this->client = new MeterReadingValuesServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listMeterReadingValues(int $page = 1,
        int $pageSize = 10,
        ?string $search = null,
        ?int $meterParameterId = null): GrpcServiceResponse
    {

        $request = new ListMeterReadingValuesRequest;
        if ($page) {
            $request->setPage($page);
        }
        if ($pageSize) {
            $request->setPageSize($pageSize);
        }
        if ($search) {
            $request->setSearch($search);
        }

        [$response, $status] = $this->client->listMeterReadingValues($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details
            );
        }
        $valuesArray = [];
        foreach ($response->getReadings() as $reading) {
            $valuesArray[] = $this->toArrayList($reading);
        }

        return GrpcServiceResponse::success(
            $valuesArray,
            $response,
            $status->code,
            $status->details
        );

    }

    public function getMeterReadingValues(?int $meterReadingValuesId = null,
        ?int $meterId = null,
        ?int $meterParameterId = null,
        ?int $timezoneId = null,
        ?int $meterReadingId = null): GrpcServiceResponse
    {
        $request = new GetMeterReadingValuesRequest;
        if ($meterReadingValuesId) {
            $request->setMeterReadingValuesId($meterReadingValuesId);
        }
        if ($meterId) {
            $request->setMeterId($meterId);
        }
        if ($meterParameterId) {
            $request->setMeterParameterId($meterParameterId);
        }
        if ($timezoneId) {
            $request->setTimezoneId($timezoneId);
        }
        if ($meterReadingId) {
            $request->setMeterReadingId($meterReadingId);
        }

        [$response, $status] = $this->client->getMeterReadingValues($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            $this->toArray($response),
            $response,
            $status->code,
            $status->details
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(GetMeterReadingValuesResponse $response): array
    {
        return [
            'id' => $response->getReading()?->getMeterReadingValuesId(),
            'meter_id' => $response->getReading()?->getMeterId(),
            'parameter_id' => $response->getReading()?->getParameterId(),
            'timezone_id' => $response->getReading()?->getTimezoneId(),
            'initial' => $response->getReading()?->getInitialReading(),
            'final' => $response->getReading()?->getFinalReading(),
            'diff' => $response->getReading()?->getDifference(),
            'value' => $response->getReading()?->getValue(),
            'created_by' => $response->getReading()?->getCreatedBy(),
            'updated_by' => $response->getReading()?->getUpdatedBy(),
            'is_active' => $response->getReading()?->getIsActive(),
            'meter' => $response->getReading()?->getMeter(),
            'timezone' => $this->parameterValueService->toArray($response->getReading()?->getTimezone()),
            'parameter' => $this->meteringParameterProfileService->toArray($response->getReading()?->getParameter()),
        ];
    }

    public function toArrayList(MeterReadingValuesMessage $response): array
    {
        return [
            'id' => $response->getMeterReadingValuesId(),
            'meter_id' => $response->getMeterId(),
            'parameter_id' => $response->getParameterId(),
            'timezone_id' => $response->getTimezoneId(),
            'initial' => $response->getInitialReading(),
            'final' => $response->getFinalReading(),
            'diff' => $response->getDifference(),
            'value' => $response->getValue(),
            'created_by' => $response->getCreatedBy(),
            'updated_by' => $response->getUpdatedBy(),
            'is_active' => $response->getIsActive(),
            'meter' => $response->getMeter(),
            'timezone' => $this->parameterValueService->toArray($response->getTimezone()),
            'parameter' => $this->meteringParameterProfileService->toArray($response->getParameter()),
        ];
    }
}
