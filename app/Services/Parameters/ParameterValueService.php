<?php

namespace App\Services\Parameters;

use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Parameters\ParameterValueServiceClient;
use Proto\Parameters\ListParameterValuesRequest;


class ParameterValueService
{
    private $client;
    public function __construct()
    {
        $this->client = new ParameterValueServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function getParameterValues(int $page, int $pageSize, ?string $search, ?int $domainId): GrpcServiceResponse
    {
        $request = new ListParameterValuesRequest;
        $request->setPage($page ?? 1);
        $request->setPageSize($pageSize ?? 10);

        [$response, $status] = $this->client->listParameterValues($request)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        $parameterValues = $response->getValues();
        $parameterValuesArray = [];

        if ($parameterValues) {
            foreach ($parameterValues as $parameterValue) {
                $parameterValuesArray[] = [
                    'id' => $parameterValue->getId(),
                    'parameter_value' => $parameterValue->getParameterValue(),
                    'parameter_value_code' => $parameterValue->getParameterValueCode(),
                    'attribute1_value' => $parameterValue->getAttribute1Value(),
                    'attribute2_value' => $parameterValue->getAttribute2Value(),
                    'attribute3_value' => $parameterValue->getAttribute3Value(),
                    'attribute4_value' => $parameterValue->getAttribute4Value(),
                    'attribute5_value' => $parameterValue->getAttribute5Value(),
                    'parameter_domain_id' => $parameterValue->getParameterDomainId(),
                    'parameter_definition_name' => $parameterValue->getParameterDefinition(),
                    'is_active' => $parameterValue->getIsActive(),
                    'sort_priority' => $parameterValue->getSortPriority(),
                    'notes' => $parameterValue->getNotes(),
                ];
            }
        }

        return GrpcServiceResponse::success($parameterValuesArray, $response, $status->code, $status->details);
    }

    // public function createParameterValue(CreateParameterValueRequest $request): GrpcServiceResponse
    // {
    //     [$response, $status] = $this->client->createParameterValue($request)->wait();

    //     $errorResponse = GrpcErrorService::handleErrorResponse($status);
    //     if ($errorResponse !== null) {
    //         return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
    //     }

    //     return GrpcServiceResponse::success($response->getParameterValue(), $response, $status->code, $status->details);
    // }

    // public function updateParameterValue(UpdateParameterValueRequest $request): ParameterValueProto
    // {
    //     return $this->client->updateParameterValue($request)->getParameterValue();
    // }

    // public function deleteParameterValue(DeleteParameterValueRequest $request): ParameterValueProto
    // {
    //     return $this->client->deleteParameterValue($request);
    // }

    // public function getParameterValue(GetParameterValueRequest $request): ParameterValueProto
    // {
    //     return $this->client->getParameterValue($request);
    // }

    // public function listParameterValues(ListParameterValuesRequest $request): ParameterValueProto
    // {
    //     return $this->client->listParameterValues($request);
    // }
}
