<?php

namespace App\Services\Metering;

use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Metering\MeterTransformerMessage;
use Proto\Metering\CreateMeterTransformerRequest;
use Proto\Metering\DeleteMeterTransformerRequest;
use Proto\Metering\GetMeterTransformerRequest;
use Proto\Metering\ListMeterTransformersRequest;
use Proto\Metering\MeterTransformerResponse;
use Proto\Metering\MeterTransformerServiceClient;
use Proto\Metering\UpdateMeterTransformerRequest;
use Proto\Metering\CreateMeterTransformerMessage;

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
    $transformer = new CreateMeterTransformerMessage();
    $transformer->setOwnershipTypeId($data['ownership_type_id']);
    $transformer->setAccuracyClassId($data['accuracy_class_id']);
    $transformer->setBurdenId($data['burden_id']);
    $transformer->setMakeId($data['make_id']);
    $transformer->setTypeId($data['type_id']);
    $transformer->setCtptSerial($data['ctpt_serial']);
    $transformer->setCtRatio(isset($data['ct_ratio']) ? (string) $data['ct_ratio'] : '');
    $transformer->setPtRatio(isset($data['pt_ratio']) ? (string) $data['pt_ratio'] : '');
    $transformer->setCreatedBy($data['created_by']);


    // Wrap in Create request
    $request = new CreateMeterTransformerRequest();
    $request->setTransformer($transformer);


        [$response, $status] = $this->client->CreateMeterTransformer($request)->wait();
       
        // \Log::info('Create transformer response:', [
        //     'status_code' => $status->code,
        //     'status_details' => $status->details,
        //     'response_id' => $response ? $response->getMeterCtptId() : null
        // ]);

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            self::transformerProtoToArray($response),
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
            self::transformerProtoToArray($response),
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
            $transformersArray[] = self::transformerProtoToArray($transformer);
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

    /**
     * Convert proto to array
     */
    public static function transformerProtoToArray(MeterTransformerMessage  $t): array
    {
       
        $createdTs  = $t->getCreatedTs() ?: null;
        $updatedTs  = $t->getUpdatedTs() ?: null;


        return [
                'meter_ctpt_id' => $t->getMeterCtptId(),
                'ownership_type_id' => $t->getOwnershipTypeId(),
                'accuracy_class_id' => $t->getAccuracyClassId(),
                'burden_id' => $t->getBurdenId(),
                'make_id' => $t->getMakeId(),
                'type_id' => $t->getTypeId(),
                'ownership_type' => self::transformParameterValueToArray($t->getOwnershipType()),
                'accuracy_class' => self::transformParameterValueToArray($t->getAccuracyClass()),
                'burden' => self::transformParameterValueToArray($t->getBurden()),
                'make' => self::transformParameterValueToArray($t->getMake()),
                'type' => self::transformParameterValueToArray($t->getType()),
                'ctpt_serial' => $t->getCtptSerial(),
                'ct_ratio' => $t->getCtRatio(),
                'pt_ratio' => $t->getPtRatio(),
                'created_ts' => $t->getCreatedTs() ?: null,
                'updated_ts' => $t->getUpdatedTs() ?: null,
                'created_by' => $t->getCreatedBy(),
        ];
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
