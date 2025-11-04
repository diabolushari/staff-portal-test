<?php

namespace App\Services\Metering;

use App\GrpcConverters\Metering\MeterTransformerProtoConvertor;
use App\Http\Requests\Metering\MeterTransformerFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Metering\CreateMeterTransformerMessage;
use Proto\Metering\CreateMeterTransformerRequest;
use Proto\Metering\DeleteMeterTransformerRequest;
use Proto\Metering\GetMeterTransformerRequest;
use Proto\Metering\ListMeterTransformersRequest;
use Proto\Metering\ListUnassignedMeterTransformersRequest;
use Proto\Metering\MeterTransformerPaginatedListRequest;
use Proto\Metering\MeterTransformerServiceClient;

class MeterTransformerService
{
    private MeterTransformerServiceClient $client;

    public function __construct()
    {
        $this->client = new MeterTransformerServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createTransformer(MeterTransformerFormRequest $request): GrpcServiceResponse
    {
        $transformer = new CreateMeterTransformerMessage;
        $transformer->setOwnershipTypeId($request->ownership_type_id);
        $transformer->setAccuracyClassId($request->accuracy_class_id);
        $transformer->setBurdenId($request->burden_id);
        $transformer->setMakeId($request->make_id);
        $transformer->setTypeId($request->type_id);
        $transformer->setCtptSerial($request->ctpt_serial);
        $transformer->setRatioPrimaryValue($request->ratio_primary_value ?? '');
        $transformer->setRatioSecondaryValue($request->ratio_secondary_value ?? '');

        if (! empty($request->manufacture_date)) {
            $timestamp = new Timestamp;
            $timestamp->fromDateTime(new \DateTime($request->manufacture_date));
            $transformer->setManufactureDate($timestamp);
        }

        $transformer->setCreatedBy($request->created_by);

        // Wrap in Create request
        $request = new CreateMeterTransformerRequest;
        $request->setTransformer($transformer);

        [$response, $status] = $this->client->CreateMeterTransformer($request)->wait();

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

    public function listTransformersPaginated(int $pageNumber = 1, int $pageSize = 10, ?string $ctptSerial = null, ?string $sortBy = null,
        ?string $sortDirection = null): GrpcServiceResponse
    {
        $request = new MeterTransformerPaginatedListRequest;
        $request->setPageNumber($pageNumber);
        $request->setPageSize($pageSize);

        if ($ctptSerial) {
            $request->setCtptSerial($ctptSerial);
        }

        if ($sortBy !== null && $sortBy !== '') {
            $request->setSortBy($sortBy);
        }

        if ($sortDirection !== null && $sortDirection !== '') {
            $request->setSortDirection($sortDirection);
        }

        [$response, $status] = $this->client->ListMeterTransformersPaginated($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $transformers = array_map(
            fn ($o) => MeterTransformerProtoConvertor::convertToArray($o),
            iterator_to_array($response->getTransformers())
        );

        return GrpcServiceResponse::success([
            'transformers' => $transformers,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ], $response, $status->code, $status->details);

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
}
