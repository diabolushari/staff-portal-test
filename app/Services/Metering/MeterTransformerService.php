<?php

namespace App\Services\Metering;

use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use App\GrpcConverters\MeterTransformerProtoConvertor;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Metering\CreateMeterTransformerMessage;
use Proto\Metering\CreateMeterTransformerRequest;
use Proto\Metering\DeleteMeterTransformerRequest;
use Proto\Metering\GetMeterTransformerRequest;
use Proto\Metering\ListMeterTransformersRequest;
use Proto\Metering\ListUnassignedMeterTransformersRequest;
use Proto\Metering\MeterTransformerMessage;
use Proto\Metering\MeterTransformerServiceClient;

class MeterTransformerService
{
    private $client;

    public function __construct()
    {
        $this->client = new MeterTransformerServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createTransformer(array $data): GrpcServiceResponse
    {
        $transformer = new CreateMeterTransformerMessage;
        $transformer->setOwnershipTypeId($data['ownership_type_id']);
        $transformer->setAccuracyClassId($data['accuracy_class_id']);
        $transformer->setBurdenId($data['burden_id']);
        $transformer->setMakeId($data['make_id']);
        $transformer->setTypeId($data['type_id']);
        $transformer->setCtptSerial($data['ctpt_serial']);
        $transformer->setRatioPrimaryValue($data['ratio_primary_value'] ?? '');
        $transformer->setRatioSecondaryValue($data['ratio_secondary_value'] ?? '');

        if (! empty($data['manufacture_date'])) {
            $timestamp = new Timestamp;
            $timestamp->fromDateTime(new \DateTime($data['manufacture_date']));
            $transformer->setManufactureDate($timestamp);
        }

        $transformer->setCreatedBy($data['created_by']);

        // Wrap in Create request
        $request = new CreateMeterTransformerRequest;
        $request->setTransformer($transformer);

        [$response, $status] = $this->client->CreateMeterTransformer($request)->wait();
        \Log::info('Create transformer response:', [
            'status_code' => $status->code,
            'status_details' => $status->details,
            'response_id' => $response ? $response->getMeterCtptId() : null,
        ]);

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            MeterTransformerProtoConvertor::convertToArray($response),
            $response,
            $status->code,
            $status->details
        );
    }

    public function getTransformer(int $id): GrpcServiceResponse
    {
        $request = new GetMeterTransformerRequest;
        $request->setMeterCtptId($id);

        [$response, $status] = $this->client->GetMeterTransformer($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            MeterTransformerProtoConvertor::convertToArray($response),
            $response,
            $status->code,
            $status->details
        );
    }

    public function listTransformers(): GrpcServiceResponse
    {
        $request = new ListMeterTransformersRequest;

        [$response, $status] = $this->client->ListMeterTransformers($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $transformersArray = [];
        foreach ($response->getTransformers() as $transformer) {
            $transformersArray[] = MeterTransformerProtoConvertor::convertToArray($transformer);
        }
        logger()->info('Fetched transformers from gRPC', $transformersArray);

        return GrpcServiceResponse::success($transformersArray, $response, $status->code, $status->details);
    }

    public function listUnassignedTransformers(): GrpcServiceResponse
    {
        $request = new ListUnassignedMeterTransformersRequest;
        $request->setPage(1);
        $request->setPageSize(100);

        [$response, $status] = $this->client->ListUnassignedMeterTransformers($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $transformersArray = [];
        foreach ($response->getTransformers() as $transformer) {
            $transformersArray[] = MeterTransformerProtoConvertor::convertToArray($transformer);
        }
        logger()->info('Fetched transformers from gRPC', $transformersArray);

        return GrpcServiceResponse::success($transformersArray, $response, $status->code, $status->details);
    }

    public function deleteTransformer(int $id): GrpcServiceResponse
    {
        $request = new DeleteMeterTransformerRequest;
        $request->setMeterCtptId($id);

        [$response, $status] = $this->client->DeleteMeterTransformer($request)->wait();

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

    
   
    private static function transformParameterValueToArray($parameterValue): ?array
    {
        if ($parameterValue === null) {
            return null;
        }

        return [
            'id' => $parameterValue->getId(),
            'parameter_value' => $parameterValue->getParameterValue(),
        ];
    }
}
