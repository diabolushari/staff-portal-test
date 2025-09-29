<?php

namespace App\Services\Metering;

use App\Http\Requests\Metering\MeterReadingForm;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Metering\CreateMeterReadingsRequest;
use Proto\Metering\CreateMeterReadingValues;
use Proto\Metering\GetMeterReadingsRequest;
use Proto\Metering\ListMeterReadingsRequest;
use Proto\Metering\MeterReadingsMessage;
use Proto\Metering\MeterReadingsServiceClient;
use Proto\Metering\MeterReadingValue;

class MeterReadingService
{
    private MeterReadingsServiceClient $client;

    public function __construct(

    ) {
        $this->client = new MeterReadingsServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listMeterReadings(?int $page = 1, ?int $pageSize = 10, ?string $search = null, ?int $connectionId = null): GrpcServiceResponse
    {
        $protoRequest = new ListMeterReadingsRequest;
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
        [$response, $status] = $this->client->ListMeterReadings($protoRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $meterReadingsArray = [];
        foreach ($response->getDetails() as $detail) {
            $detail = $this->toArray($detail);
            $meterReadingsArray[] = $detail;
        }

        return GrpcServiceResponse::success($meterReadingsArray, $response, $status->code, $status->details);
    }

    public function createMeterReading(MeterReadingForm $request): GrpcServiceResponse
    {
        $grpcRequest = $this->toProto($request);
        [$response, $status] = $this->client->CreateMeterReadings($grpcRequest)->wait();
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

    public function getMeterReadingById(int $id): GrpcServiceResponse
    {
        $protoRequest = new GetMeterReadingsRequest;
        $protoRequest->setMeterReadingDetailId($id);
        [$response, $status] = $this->client->GetMeterReadings($protoRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success($this->toArray($response), $response, $status->code, $status->details);
    }

    public function toProto(MeterReadingForm $request): CreateMeterReadingsRequest
    {
        $protoRequest = new CreateMeterReadingsRequest;

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
    public function toArray(MeterReadingsMessage $detail): array
    {
        return [
            'id' => $detail->getMeterReadingDetailId(),
            'metering_date' => $detail->getMeteringDate(),
            'reading_start_date' => $detail->getReadingStartDate(),
            'reading_end_date' => $detail->getReadingEndDate(),
            'meter_reading_detail_id' => $detail->getMeterReadingDetailId(),
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
        ];
    }
}
