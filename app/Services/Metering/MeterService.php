<?php

namespace App\Services\Metering;

use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Consumers\CreateMeterRequest;
use Proto\Consumers\DeleteMeterRequest;
use Proto\Consumers\GetMeterRequest;
use Proto\Consumers\ListMetersRequest;
use Proto\Consumers\MeterResponse;
use Proto\Consumers\MeterServiceClient;
use Proto\Consumers\UpdateMeterRequest;

class MeterService
{
    private $client;

    public function __construct()
    {
        $this->client = new MeterServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createMeter(array $data): GrpcServiceResponse
    {
        $request = new CreateMeterRequest;
        $request->setMeterSerial($data['meter_serial']);
        $request->setOwnershipTypeId($data['ownership_type_id']);
        $request->setMeterMakeId($data['meter_make_id']);
        $request->setMeterTypeId($data['meter_type_id']);
        $request->setMeterCategoryId($data['meter_category_id']);
        $request->setAccuracyClassId($data['accuracy_class_id']);
        $request->setDialingFactorId($data['dialing_factor_id']);
        $request->setCompanySealNum($data['company_seal_num']);
        $request->setDigitCount($data['digit_count']);
        $request->setVoltageMeterRatio($data['voltage_meter_ratio']);
        $request->setCurrentMeterRatio($data['current_meter_ratio']);

        $manufactureDate = new Timestamp;
        $manufactureDate->fromDateTime(new \DateTime($data['manufacture_date']));
        $request->setManufactureDate($manufactureDate);

        $supplyDate = new Timestamp;
        $supplyDate->fromDateTime(new \DateTime($data['supply_date']));
        $request->setSupplyDate($supplyDate);

        $request->setMeterUnitId($data['meter_unit_id']);
        $request->setMeterResetTypeId($data['meter_reset_type_id']);
        $request->setSmartMeterInd($data['smart_meter_ind']);
        $request->setBidirectionalInd($data['bidirectional_ind']);
        $request->setCreatedBy($data['created_by']);

        [$response, $status] = $this->client->CreateMeter($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterProtoToArray($response), $response, $status->code, $status->details);
    }

    public function getMeter(int $meterId): GrpcServiceResponse
    {
        $request = new GetMeterRequest;
        $request->setMeterId($meterId);

        [$response, $status] = $this->client->GetMeter($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterProtoToArray($response), $response, $status->code, $status->details);
    }

    public function listMeters(): GrpcServiceResponse
    {
        $request = new ListMetersRequest;

        [$response, $status] = $this->client->ListMeters($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $metersArray = [];
        foreach ($response->getMeters() as $meter) {
            $metersArray[] = self::meterProtoToArray($meter);
        }

        return GrpcServiceResponse::success($metersArray, $response, $status->code, $status->details);
    }

    public function updateMeter(array $data): GrpcServiceResponse
    {
        $request = new UpdateMeterRequest;
        $request->setMeterId($data['meter_id']);
        $request->setMeterSerial($data['meter_serial']);
        $request->setOwnershipTypeId($data['ownership_type_id']);
        $request->setMeterMakeId($data['meter_make_id']);
        $request->setMeterTypeId($data['meter_type_id']);
        $request->setMeterCategoryId($data['meter_category_id']);
        $request->setAccuracyClassId($data['accuracy_class_id']);
        $request->setDialingFactorId($data['dialing_factor_id']);
        $request->setCompanySealNum($data['company_seal_num']);
        $request->setDigitCount($data['digit_count']);
        $request->setVoltageMeterRatio($data['voltage_meter_ratio']);
        $request->setCurrentMeterRatio($data['current_meter_ratio']);

        $manufactureDate = new Timestamp;
        $manufactureDate->fromDateTime(new \DateTime($data['manufacture_date']));
        $request->setManufactureDate($manufactureDate);

        $supplyDate = new Timestamp;
        $supplyDate->fromDateTime(new \DateTime($data['supply_date']));
        $request->setSupplyDate($supplyDate);

        $request->setMeterUnitId($data['meter_unit_id']);
        $request->setMeterResetTypeId($data['meter_reset_type_id']);
        $request->setSmartMeterInd($data['smart_meter_ind']);
        $request->setBidirectionalInd($data['bidirectional_ind']);
        $request->setUpdatedBy($data['updated_by']);

        [$response, $status] = $this->client->UpdateMeter($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::meterProtoToArray($response), $response, $status->code, $status->details);
    }

    public function deleteMeter(int $meterId): GrpcServiceResponse
    {
        $request = new DeleteMeterRequest;
        $request->setMeterId($meterId);

        [$response, $status] = $this->client->DeleteMeter($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }

    /**
     * Static utility function to convert MeterResponse proto to associative array
     */
    public static function meterProtoToArray(MeterResponse $meter): array
    {
        $manufactureDate = $meter->getManufactureDate()
            ? $meter->getManufactureDate()->toDateTime()->format('Y-m-d')
            : null;

        $supplyDate = $meter->getSupplyDate()
            ? $meter->getSupplyDate()->toDateTime()->format('Y-m-d')
            : null;

        $createdTs = $meter->getCreatedTs()
            ? $meter->getCreatedTs()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        $updatedTs = $meter->getUpdatedTs()
            ? $meter->getUpdatedTs()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        return [
            'version_id' => $meter->getVersionId(),
            'meter_id' => $meter->getMeterId(),
            'meter_serial' => $meter->getMeterSerial(),
            'ownership_type' => self::transformParameterValueToArray($meter->getOwnershipType()),
            'meter_make' => self::transformParameterValueToArray($meter->getMeterMake()),
            'meter_type' => self::transformParameterValueToArray($meter->getMeterType()),
            'meter_category' => self::transformParameterValueToArray($meter->getMeterCategory()),
            'accuracy_class' => self::transformParameterValueToArray($meter->getAccuracyClass()),
            'dialing_factor' => self::transformParameterValueToArray($meter->getDialingFactor()),
            'company_seal_num' => $meter->getCompanySealNum(),
            'digit_count' => $meter->getDigitCount(),
            'voltage_meter_ratio' => $meter->getVoltageMeterRatio(),
            'current_meter_ratio' => $meter->getCurrentMeterRatio(),
            'manufacture_date' => $manufactureDate,
            'supply_date' => $supplyDate,
            'meter_unit' => self::transformParameterValueToArray($meter->getMeterUnit()),
            'meter_reset_type' => self::transformParameterValueToArray($meter->getMeterResetType()),
            'smart_meter_ind' => $meter->getSmartMeterInd(),
            'bidirectional_ind' => $meter->getBidirectionalInd(),
            'created_ts' => $createdTs,
            'updated_ts' => $updatedTs,
            'created_by' => $meter->getCreatedBy(),
            'updated_by' => $meter->getUpdatedBy(),
        ];
    }

    /**
     * Transform ParameterValueProto to PHP array
     */
    private static function transformParameterValueToArray($parameterValue): ?array
    {
        if ($parameterValue === null) {
            return null;
        }

        // The structure is assumed based on usage in the provided controller context
        return [
            'id' => $parameterValue->getId(),
            'parameter_value' => $parameterValue->getParameterValue(),
        ];
    }
}
