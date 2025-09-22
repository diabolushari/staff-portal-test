<?php

namespace App\Services\Metering;

use App\Http\Requests\Metering\MeterReadingForm;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Consumers\CreateMeterReadingDetailRequest;
use Proto\Consumers\MeterReadingDetailMessage;
use Proto\Consumers\MeterReadingDetailServiceClient;

class MeterReadingService
{
    private MeterReadingDetailServiceClient $client;

    public function __construct()
    {
        $this->client = new MeterReadingDetailServiceClient(
            config('grpc.meter_reading_service.host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createMeterReading(MeterReadingForm $request): GrpcServiceResponse
    {
        [$response, $status] = $this->client->CreateMeterReadingDetail($this->toProto($request))->wait();
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

    public function toProto(MeterReadingForm $request): CreateMeterReadingDetailRequest
    {
        $protoRequest = new CreateMeterReadingDetailRequest;
        $protoMessage = new MeterReadingDetailMessage;
        $protoMessage->setConnectionId($request->connection_id);
        $protoMessage->setNormalPf($request->normal_pf);
        $protoMessage->setPeakPf($request->peak_pf);
        $protoMessage->setOffpeakPf($request->offpeak_pf);
        $protoMessage->setAveragePowerFactor($request->average_power_factor);
        if ($request->reading_type == 'singel_reading') {
            $protoMessage->setSingleReading(true);
            $protoMessage->setMultipleReading(false);
        } else {
            $protoMessage->setMultipleReading(true);
            $protoMessage->setSingleReading(false);
        }
        $protoMessage->setAnomalyId($request->anomaly_id);
        $protoMessage->setMeterHealthId($request->meter_health_id);
        $protoMessage->setCtptHealthId($request->ctpt_health_id);
        $protoMessage->setVoltageR($request->voltage_r);
        $protoMessage->setVoltageY($request->voltage_y);
        $protoMessage->setVoltageB($request->voltage_b);
        $protoMessage->setCurrentR($request->current_r);
        $protoMessage->setCurrentY($request->current_y);
        $protoMessage->setCurrentB($request->current_b);
        $protoMessage->setRemarks($request->remarks);

        $protoRequest->setDetail($protoMessage);

        return $protoRequest;
    }
}
