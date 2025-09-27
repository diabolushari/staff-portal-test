<?php

namespace App\Services\Metering;

use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Consumers\MeterResponse;
use Proto\MeterReading\ListMeterReadingValuesRequest;
use Proto\MeterReading\MeterReadingValuesMessage;
use Proto\MeterReading\MeterReadingValuesServiceClient;

class MeterReadingValueService
{
    private MeterReadingValuesServiceClient $client;

    public function __construct(
        private ParameterValueService $parameterValueService,
        private MeteringParameterProfileService $meteringParameterProfileService,
        private MeterService $meterService
    ) {
        $this->client = new MeterReadingValuesServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listMeterReadingValues(int $page = 1,
        int $pageSize = 10,
        ?string $search = null,
        ?int $meterId = null,
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
        if ($meterId) {
            $request->setMeterId($meterId);
        }
        if ($meterParameterId) {
            $request->setMeterParameterId($meterParameterId);
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
            $valuesArray[] = $this->toArray($reading);
        }

        return GrpcServiceResponse::success(
            $valuesArray,
            $response,
            $status->code,
            $status->details
        );

    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(MeterReadingValuesMessage $response): array
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
            'meter' => $this->meterService->meterProtoToArray($response->getMeter() ?? new MeterResponse),
            'timezone' => $this->parameterValueService->toArray($response->getTimezone()),
            'parameter' => $this->meteringParameterProfileService->toArray($response->getParameter()),
        ];
    }
}
