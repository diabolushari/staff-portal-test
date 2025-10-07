<?php

namespace App\Services\Metering;

use App\Http\Requests\Metering\MeterReadingForm;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\MeterReading\CreateMeterReadingRequest;
use Proto\MeterReading\CreateMeterReadingValues;
use Proto\MeterReading\GetMeterReadingRequest;
use Proto\MeterReading\LatestMeterReadingRequest;
use Proto\MeterReading\ListMeterReadingRequest;
use Proto\MeterReading\MeterReadingMessage;
use Proto\MeterReading\MeterReadingServiceClient;
use Proto\MeterReading\ReadingValueMessage;

class MeterReadingService
{
    private MeterReadingServiceClient $client;

    public function __construct(
        private ParameterValueService $parameterValueService,
        private MeterService $meterService,
        private MeteringParameterProfileService $meteringParameterProfileService
    ) {
        $this->client = new MeterReadingServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listMeterReadings(?int $page = 1, ?int $pageSize = 10, ?string $search = null, ?int $connectionId = null): GrpcServiceResponse
    {
        $protoRequest = new ListMeterReadingRequest;
        if ($page) {
            $protoRequest->setPage($page);
        }
        if ($pageSize) {
            $protoRequest->setPageSize($pageSize);
        }
        if ($search) {
            $protoRequest->setSearch($search);
        }
        if ($connectionId) {
            $protoRequest->setConnectionId($connectionId);
        }
        [$response, $status] = $this->client->ListMeterReading($protoRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $meterReadingsArray = [];
        foreach ($response->getReadings() as $detail) {
            $detail = $this->toArray($detail);
            $meterReadingsArray[] = $detail;
        }

        return GrpcServiceResponse::success($meterReadingsArray, $response, $status->code, $status->details);
    }

    public function createMeterReading(MeterReadingForm $request): GrpcServiceResponse
    {
        $grpcRequest = $this->toProto($request);
        [$response, $status] = $this->client->CreateMeterReading($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success([], $response, $status->code, $status->details);
    }

    public function getMeterReading(int $id, ?int $meterId = null): GrpcServiceResponse
    {
        $protoRequest = new GetMeterReadingRequest;
        $protoRequest->setMeterReadingId($id);
        if ($meterId) {
            $protoRequest->setMeterId($meterId);
        }
        [$response, $status] = $this->client->GetMeterReading($protoRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $meterReadingValuesArray = [];
        foreach ($response->getValues() as $value) {
            $value = $this->meterReadingValuesToArray($value);
            $meterReadingValuesArray[] = $value;
        }
        $meterReadingArray = $this->toArray($response->getReading());
        $meterReadingArray['values'] = $meterReadingValuesArray;

        return GrpcServiceResponse::success($meterReadingArray, $response, $status->code, $status->details);
    }

    public function latestMeterReading(int $connectionId): GrpcServiceResponse
    {
        $protoRequest = new LatestMeterReadingRequest;
        $protoRequest->setConnectionId($connectionId);
        [$response, $status] = $this->client->LatestMeterReading($protoRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $meterReadingArray = $this->toArray($response->getReading());
        $meterReadingValuesArray = [];
        foreach ($response->getValues() as $value) {
            $value = $this->meterReadingValuesToArray($value);
            $meterReadingValuesArray[] = $value;
        }
        $meterReadingArray['values'] = $meterReadingValuesArray;

        return GrpcServiceResponse::success($meterReadingArray, $response, $status->code, $status->details);
    }

    public function toProto(MeterReadingForm $request): CreateMeterReadingRequest
    {
        $protoRequest = new CreateMeterReadingRequest;

        $protoRequest->setConnectionId($request->connection_id);
        $protoRequest->setNormalPf($request->normal_pf ?? 15.50);
        $protoRequest->setPeakPf($request->peak_pf ?? 15.50);
        $protoRequest->setOffpeakPf($request->offpeak_pf ?? 15.50);
        $protoRequest->setMeteringDate($request->metering_date);
        $protoRequest->setReadingStartDate($request->reading_start_date);
        $protoRequest->setReadingEndDate($request->reading_end_date);
        $protoRequest->setAveragePowerFactor($request->average_power_factor ?? 15.50);

        if ($request->reading_type === 'single_reading') {
            $protoRequest->setSingleReading(true);
            $protoRequest->setMultipleReading(false);
        } else {
            $protoRequest->setMultipleReading(true);
            $protoRequest->setSingleReading(false);
        }

        $protoRequest->setAnomalyId($request->anomaly_id);
        $protoRequest->setMeterHealthId($request->meter_health_id);
        $protoRequest->setCtptHealthId($request->ctpt_health_id);
        $protoRequest->setVoltageR($request->voltage_r);
        $protoRequest->setVoltageY($request->voltage_y);
        $protoRequest->setVoltageB($request->voltage_b);
        $protoRequest->setCurrentR($request->current_r);
        $protoRequest->setCurrentY($request->current_y);
        $protoRequest->setCurrentB($request->current_b);
        $protoRequest->setRemarks($request->remarks);
        $protoRequest->setCreatedBy(1);
        $protoRequest->setIsActive(true);

        // 🔑 Flatten readings_by_meter into MeterReadingValue list
        foreach ($request->readings_by_meter as $meter) {
            if (empty($meter['meter_id'])) {
                continue; // skip if meter_id missing
            }
            $meterId = (int) $meter['meter_id'];

            if (empty($meter['parameters']) || ! is_array($meter['parameters'])) {
                continue; // skip if no parameters
            }

            foreach ($meter['parameters'] as $parameter) {
                if (empty($parameter['meter_parameter_id'])) {
                    continue; // skip if parameter_id missing
                }
                $parameterId = (int) $parameter['meter_parameter_id'];

                if (empty($parameter['readings']) || ! is_array($parameter['readings'])) {
                    continue; // skip if no readings
                }

                foreach ($parameter['readings'] as $reading) {
                    if (empty($reading['timezone_id'])) {
                        continue; // skip if timezone missing
                    }
                    $timezoneId = (int) $reading['timezone_id'];

                    $values = $reading['values'] ?? null;
                    if (! $values || ! is_array($values)) {
                        continue; // skip if no values
                    }

                    // extract safely, default to null
                    $initial = $values['initial'] ?? null;
                    $final = $values['final'] ?? null;
                    $diff = $values['diff'] ?? null;
                    $value = $values['final'] ?? null;

                    // ensure required values exist (initial/final/diff/value at least one must be non-null)
                    if ($initial === null && $final === null && $diff === null && $value === null) {
                        continue; // nothing to save
                    }

                    $protoReading = new CreateMeterReadingValues;
                    $protoReading->setMeterId($meterId);
                    $protoReading->setParameterId($parameterId);
                    $protoReading->setTimezoneId($timezoneId);

                    if ($initial !== null) {
                        $protoReading->setInitialReading((float) $initial);
                    }
                    if ($final !== null) {
                        $protoReading->setFinalReading((float) $final);
                    }
                    if ($diff !== null) {
                        $protoReading->setDifference((float) $diff);
                    }
                    if ($value !== null) {
                        $protoReading->setValue((float) $value);
                    }

                    $protoReading->setCreatedBy(1);

                    $protoRequest->getReadings()[] = $protoReading;

                }
            }
        }

        return $protoRequest;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(MeterReadingMessage $detail): array
    {

        $values = [];
        foreach ($detail->getValues() as $value) {
            $values[] = $this->meterReadingValuesToArray($value);
        }

        return [
            'id' => $detail->getMeterReadingId(),
            'metering_date' => $detail->getMeteringDate(),
            'reading_start_date' => $detail->getReadingStartDate(),
            'reading_end_date' => $detail->getReadingEndDate(),
            'connection_id' => $detail->getConnectionId(),
            'normal_pf' => $detail->getNormalPf(),
            'peak_pf' => $detail->getPeakPf(),
            'offpeak_pf' => $detail->getOffpeakPf(),
            'average_power_factor' => $detail->getAveragePowerFactor(),
            'single_reading' => $detail->getSingleReading(),
            'multiple_reading' => $detail->getMultipleReading(),
            'anomaly_id' => $detail->getAnomalyId(),
            'meter_health_id' => $detail->getMeterHealthId(),
            'ctpt_health_id' => $detail->getCtptHealthId(),
            'voltage_r' => $detail->getVoltageR(),
            'voltage_y' => $detail->getVoltageY(),
            'voltage_b' => $detail->getVoltageB(),
            'current_r' => $detail->getCurrentR(),
            'current_y' => $detail->getCurrentY(),
            'current_b' => $detail->getCurrentB(),
            'remarks' => $detail->getRemarks(),
            'created_by' => $detail->getCreatedBy(),
            'updated_by' => $detail->getUpdatedBy(),
            'is_active' => $detail->getIsActive(),
            'values' => $values,
        ];
    }

    public function meterReadingValuesToArray(ReadingValueMessage $detail): array
    {
        return [
            'id' => $detail->getMeterReadingValuesId(),
            'meter_id' => $detail->getMeterId(),
            'parameter_id' => $detail->getParameterId(),
            'timezone_id' => $detail->getTimezoneId(),
            'initial_reading' => $detail->getInitialReading(),
            'final_reading' => $detail->getFinalReading(),
            'difference' => $detail->getDifference(),
            'value' => $detail->getValue(),
            'created_by' => $detail->getCreatedBy(),
            'updated_by' => $detail->getUpdatedBy(),
            'is_active' => $detail->getIsActive(),
            'time_zone' => $this->parameterValueService->toArray($detail->getTimezone()),
            'meter' => $this->meterService->meterProtoToArray($detail->getMeter()),
            'meter_profile_parameter' => $this->meteringParameterProfileService->toArray($detail->getParameter()),
        ];
    }
}
