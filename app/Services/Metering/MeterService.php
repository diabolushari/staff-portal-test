<?php

declare(strict_types=1);

namespace App\Services\Metering;

use App\GrpcConverters\MeterProtoConvertor;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Exception;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Illuminate\Contracts\Container\BindingResolutionException;
use InvalidArgumentException;
use Proto\Consumers\CreateMeterRequest;
use Proto\Consumers\DeleteMeterRequest;
use Proto\Consumers\GetMeterRequest;
use Proto\Consumers\ListMetersRequest;
use Proto\Consumers\MeterPaginatedListRequest;
use Proto\Consumers\MeterServiceClient;
use Proto\Consumers\UpdateMeterRequest;

class MeterService
{
    private MeterServiceClient $client;

    public function __construct()
    {
        $this->client = new MeterServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    /**
     * @param  mixed[]  $data
     *
     * @throws InvalidArgumentException
     * @throws Exception
     * @throws BindingResolutionException
     */
    public function createMeter(array $data): GrpcServiceResponse
    {
        $request = new CreateMeterRequest;

        // Required or commonly provided
        if (array_key_exists('meter_serial', $data)) {
            $request->setMeterSerial($data['meter_serial']);
        }
        if (array_key_exists('ownership_type_id', $data)) {
            $request->setOwnershipTypeId($data['ownership_type_id']);
        }
        if (array_key_exists('meter_profile_id', $data)) {
            $request->setProfileId($data['meter_profile_id']);
        }
        if (array_key_exists('meter_make_id', $data)) {
            $request->setMeterMakeId($data['meter_make_id']);
        }
        if (array_key_exists('meter_type_id', $data)) {
            $request->setMeterTypeId($data['meter_type_id']);
        }
        if (array_key_exists('meter_category_id', $data)) {
            $request->setMeterCategoryId($data['meter_category_id']);
        }
        if (array_key_exists('accuracy_class_id', $data)) {
            $request->setAccuracyClassId($data['accuracy_class_id']);
        }
        if (array_key_exists('dialing_factor_id', $data)) {
            $request->setDialingFactorId($data['dialing_factor_id']);
        }
        if (array_key_exists('company_seal_num', $data)) {
            $request->setCompanySealNum($data['company_seal_num']);
        }
        if (array_key_exists('digit_count', $data)) {
            $request->setDigitCount($data['digit_count']);
        }
        if (! empty($data['manufacture_date'])) {
            if ($ts = self::toTimestamp($data['manufacture_date'])) {
                $request->setManufactureDate($ts);
            }
        }
        if (! empty($data['supply_date'])) {
            if ($ts = self::toTimestamp($data['supply_date'])) {
                $request->setSupplyDate($ts);
            }
        }
        if (array_key_exists('meter_unit_id', $data)) {
            $request->setMeterUnitId($data['meter_unit_id']);
        }
        if (array_key_exists('meter_reset_type_id', $data)) {
            $request->setMeterResetTypeId($data['meter_reset_type_id']);
        }
        if (array_key_exists('smart_meter_ind', $data)) {
            $request->setSmartMeterInd((bool) $data['smart_meter_ind']);
        }
        if (array_key_exists('bidirectional_ind', $data)) {
            $request->setBidirectionalInd((bool) $data['bidirectional_ind']);
        }
        if (array_key_exists('created_by', $data)) {
            $request->setCreatedBy($data['created_by']);
        }

        // Newly added fields in proto
        if (array_key_exists('meter_phase_id', $data)) {
            $request->setMeterPhaseId($data['meter_phase_id']);
        }
        if (array_key_exists('decimal_digit_count', $data)) {
            $request->setDecimalDigitCount($data['decimal_digit_count']);
        }
        if (array_key_exists('programmable_pt_ratio', $data)) {
            $request->setProgrammablePtRatio((float) $data['programmable_pt_ratio']);
        }
        if (array_key_exists('programmable_ct_ratio', $data)) {
            $request->setProgrammableCtRatio($data['programmable_ct_ratio']);
        }
        if (array_key_exists('meter_mf', $data)) {
            $request->setMeterMf((float) $data['meter_mf']);
        }
        if (array_key_exists('warranty_period', $data)) {
            $request->setWarrantyPeriod($data['warranty_period']);
        }
        if (array_key_exists('meter_constant', $data)) {
            $request->setMeterConstant($data['meter_constant']);
        }
        if (array_key_exists('batch_code', $data)) {
            $request->setBatchCode($data['batch_code']);
        }

        // New nullable internal CT/PT ratios
        if (array_key_exists('internal_ct_primary', $data)) {
            $request->setInternalCtPrimary($data['internal_ct_primary']);
        }
        if (array_key_exists('internal_ct_secondary', $data)) {
            $request->setInternalCtSecondary($data['internal_ct_secondary']);
        }
        if (array_key_exists('internal_pt_primary', $data)) {
            $request->setInternalPtPrimary($data['internal_pt_primary']);
        }
        if (array_key_exists('internal_pt_secondary', $data)) {
            $request->setInternalPtSecondary($data['internal_pt_secondary']);
        }

        [$response, $status] = $this->client->CreateMeter($request)->wait();

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

        return GrpcServiceResponse::success(MeterProtoConvertor::convertToArray($response), $response, $status->code, $status->details);
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
            $metersArray[] = MeterProtoConvertor::convertToArray($meter);
        }

        return GrpcServiceResponse::success($metersArray, $response, $status->code, $status->details);
    }

    public function listMetersPaginated(int $pageNumber = 1, int $pageSize = 10, ?string $meterSerial = null, ?string $sortBy = null,
        ?string $sortDirection = null): GrpcServiceResponse
    {
        $request = new MeterPaginatedListRequest;
        $request->setPageNumber($pageNumber);
        $request->setPageSize($pageSize);

        if ($meterSerial) {
            $request->setMeterSerial($meterSerial);
        }

        if ($sortBy !== null && $sortBy !== '') {
            $request->setSortBy($sortBy);
        }

        if ($sortDirection !== null && $sortDirection !== '') {
            $request->setSortDirection($sortDirection);
        }

        [$response, $status] = $this->client->ListMetersPaginated($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $meters = array_map(
            fn ($o) => MeterProtoConvertor::convertToArray($o),
            iterator_to_array($response->getMeters())
        );

        return GrpcServiceResponse::success([
            'meters' => $meters,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ], $response, $status->code, $status->details);
    }

    /**
     * @param  mixed[]  $data
     *
     * @throws Exception
     * @throws InvalidArgumentException
     * @throws BindingResolutionException
     */
    public function updateMeter(array $data): GrpcServiceResponse
    {

        $request = new UpdateMeterRequest;
        $request->setMeterId($data['meter_id']);

        if (array_key_exists('meter_serial', $data)) {
            $request->setMeterSerial($data['meter_serial']);
        }
        if (array_key_exists('ownership_type_id', $data)) {
            $request->setOwnershipTypeId($data['ownership_type_id']);
        }
        if (array_key_exists('meter_profile_id', $data)) {
            $request->setProfileId($data['meter_profile_id']);
        }
        if (array_key_exists('meter_make_id', $data)) {
            $request->setMeterMakeId($data['meter_make_id']);
        }
        if (array_key_exists('meter_type_id', $data)) {
            $request->setMeterTypeId($data['meter_type_id']);
        }
        if (array_key_exists('meter_category_id', $data)) {
            $request->setMeterCategoryId($data['meter_category_id']);
        }
        if (array_key_exists('accuracy_class_id', $data)) {
            $request->setAccuracyClassId($data['accuracy_class_id']);
        }
        if (array_key_exists('dialing_factor_id', $data)) {
            $request->setDialingFactorId($data['dialing_factor_id']);
        }
        if (array_key_exists('company_seal_num', $data)) {
            $request->setCompanySealNum($data['company_seal_num']);
        }
        if (array_key_exists('digit_count', $data)) {
            $request->setDigitCount($data['digit_count']);
        }
        if (! empty($data['manufacture_date'])) {
            if ($ts = self::toTimestamp($data['manufacture_date'])) {
                $request->setManufactureDate($ts);
            }
        }
        if (! empty($data['supply_date'])) {
            if ($ts = self::toTimestamp($data['supply_date'])) {
                $request->setSupplyDate($ts);
            }
        }
        if (array_key_exists('meter_unit_id', $data)) {
            $request->setMeterUnitId($data['meter_unit_id']);
        }
        if (array_key_exists('meter_reset_type_id', $data)) {
            $request->setMeterResetTypeId($data['meter_reset_type_id']);
        }
        if (array_key_exists('smart_meter_ind', $data)) {
            $request->setSmartMeterInd((bool) $data['smart_meter_ind']);
        }
        if (array_key_exists('bidirectional_ind', $data)) {
            $request->setBidirectionalInd((bool) $data['bidirectional_ind']);
        }
        if (array_key_exists('updated_by', $data)) {
            $request->setUpdatedBy($data['updated_by']);
        }

        // Newly added fields in proto
        if (array_key_exists('meter_phase_id', $data)) {
            $request->setMeterPhaseId($data['meter_phase_id']);
        }
        if (array_key_exists('decimal_digit_count', $data)) {
            $request->setDecimalDigitCount($data['decimal_digit_count']);
        }
        if (array_key_exists('programmable_pt_ratio', $data)) {
            $request->setProgrammablePtRatio((float) $data['programmable_pt_ratio']);
        }
        if (array_key_exists('programmable_ct_ratio', $data)) {
            $request->setProgrammableCtRatio($data['programmable_ct_ratio']);
        }
        if (array_key_exists('meter_mf', $data)) {
            $request->setMeterMf((float) $data['meter_mf']);
        }
        if (array_key_exists('warranty_period', $data)) {
            $request->setWarrantyPeriod($data['warranty_period']);
        }
        if (array_key_exists('meter_constant', $data)) {
            $request->setMeterConstant($data['meter_constant']);
        }
        if (array_key_exists('batch_code', $data)) {
            $request->setBatchCode($data['batch_code']);
        }

        // New nullable internal CT/PT ratios
        if (array_key_exists('internal_ct_primary', $data)) {
            $request->setInternalCtPrimary($data['internal_ct_primary']);
        }
        if (array_key_exists('internal_ct_secondary', $data)) {
            $request->setInternalCtSecondary($data['internal_ct_secondary']);
        }
        if (array_key_exists('internal_pt_primary', $data)) {
            $request->setInternalPtPrimary($data['internal_pt_primary']);
        }
        if (array_key_exists('internal_pt_secondary', $data)) {
            $request->setInternalPtSecondary($data['internal_pt_secondary']);
        }

        // Optional: allow client to set updated_ts; otherwise server will set it
        if (! empty($data['updated_ts'])) {
            if ($ts = self::toTimestamp($data['updated_ts'])) {
                $request->setUpdatedTs($ts);
            }
        }

        [$response, $status] = $this->client->UpdateMeter($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(MeterProtoConvertor::convertToArray($response), $response, $status->code, $status->details);
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
     * Best-effort conversion of mixed input into a Timestamp
     * Accepts \DateTimeInterface|string|int (epoch seconds)
     */
    private static function toTimestamp(\DateTimeInterface|string|int $value): ?Timestamp
    {
        try {
            if ($value instanceof \DateTimeInterface) {
                $dt = $value;
            } elseif (is_int($value)) {
                $dt = (new \DateTimeImmutable('@'.$value))->setTimezone(new \DateTimeZone('UTC'));
            } else {
                // string
                $dt = new \DateTimeImmutable($value);
            }

            $ts = new Timestamp;
            $ts->fromDateTime($dt);

            return $ts;
        } catch (\Throwable) {
            return null;
        }
    }
}
