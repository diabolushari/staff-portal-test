<?php

namespace App\Services\Parameters;

use App\Http\Requests\Parameters\ParameterValueFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Parameters\CreateParameterValueRequest;
use Proto\Parameters\DeleteParameterValueRequest;
use Proto\Parameters\GetParameterValueRequest;
use Proto\Parameters\ParameterValueServiceClient;
use Proto\Parameters\ListParameterValuesRequest;
use Proto\Parameters\ParameterValueProto;

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

    public function getParameterValues(int $page, int $pageSize, ?string $search, ?string $domainName, ?string $parameterName): GrpcServiceResponse
    {
        $request = new ListParameterValuesRequest;
        $request->setPage($page ?? 1);
        $request->setPageSize($pageSize ?? 10);
        $request->setDomainName($domainName ?? '');
        $request->setParameterName($parameterName ?? '');

        [$response, $status] = $this->client->listParameterValues($request)->wait();

        if ($status->code !== 0) {
            $errorResponse = GrpcErrorService::handleErrorResponse($status);

            return GrpcServiceResponse::error(
                $errorResponse,
                $response,
                $status->code,
                $status->details,
                []
            );
        }

        $parameterValues = $response?->getValues();
        $parameterValuesArray = [];

        if ($parameterValues) {
            foreach ($parameterValues as $parameterValue) {
                $parameterValuesArray[] = [
                    'id' => $parameterValue->getId(),
                    'parameter_value' => $parameterValue->getParameterValue(),
                    'parameter_value_code' => $parameterValue->getParameterCode(),
                    'attribute1_value' => $parameterValue->getAttribute1Value(),
                    'attribute2_value' => $parameterValue->getAttribute2Value(),
                    'attribute3_value' => $parameterValue->getAttribute3Value(),
                    'attribute4_value' => $parameterValue->getAttribute4Value(),
                    'attribute5_value' => $parameterValue->getAttribute5Value(),
                    'is_active' => $parameterValue->getIsActive(),
                    'sort_priority' => $parameterValue->getSortPriority(),
                    'notes' => $parameterValue->getNotes(),
                ];
            }
        }

        return GrpcServiceResponse::success($parameterValuesArray, $response, $status->code, $status->details);
    }

    public function createParameterValue(ParameterValueFormRequest $request): GrpcServiceResponse
    {
        $proto = new ParameterValueProto();
        $proto->setParameterCode($request->parameterCode);
        $proto->setParameterValue($request->parameterValue);
        $proto->setDefinitionId($request->definitionId);
        $proto->setParentId($request->parentId ?? 0);
        $proto->setAttribute1Value($request->attribute1Value ?? '');
        $proto->setAttribute2Value($request->attribute2Value ?? '');
        $proto->setAttribute3Value($request->attribute3Value ?? '');
        $proto->setAttribute4Value($request->attribute4Value ?? '');
        $proto->setAttribute5Value($request->attribute5Value ?? '');
        $proto->setEffectiveStartDate($request->effectiveStartDate ?? null);
        $proto->setEffectiveEndDate($request->effectiveEndDate ?? null);
        $proto->setIsActive($request->isActive ?? true);
        $proto->setSortPriority($request->sortPriority ?? 0);
        $proto->setNotes($request->notes ?? '');

        $grpcRequest = new CreateParameterValueRequest();
        $grpcRequest->setValue($proto);

        [$response, $status] = $this->client->CreateParameterValue($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }
        $parameterValueArray = [
            'id' => $response->getParameterValue(),
            'parameter_value' => $response->getParameterValue()->getParameterValue(),
            'parameter_value_code' => $response->getParameterValue()->getParameterValueCode(),
            'attribute1_value' => $response->getParameterValue()->getAttribute1Value(),
            'attribute2_value' => $response->getParameterValue()->getAttribute2Value(),
            'attribute3_value' => $response->getParameterValue()->getAttribute3Value(),
            'attribute4_value' => $response->getParameterValue()->getAttribute4Value(),
            'attribute5_value' => $response->getParameterValue()->getAttribute5Value(),
            'parameter_domain_id' => $response->getParameterValue()->getParameterDomainId(),
            'parameter_definition' => $response->getParameterValue()->getParameterDefinition(),
            'is_active' => $response->getParameterValue()->getIsActive(),
            'sort_priority' => $response->getParameterValue()->getSortPriority(),
            'notes' => $response->getParameterValue()->getNotes(),
        ];
        return GrpcServiceResponse::success($parameterValueArray, $response, $status->code, $status->details);
    }

    // public function updateParameterValue(UpdateParameterValueRequest $request): ParameterValueProto
    // {
    //     return $this->client->updateParameterValue($request)->getParameterValue();
    // }


    public function getParameterValue(int|string $id): GrpcServiceResponse
    {
        $request = new GetParameterValueRequest();
        $request->setId((int)$id);

        [$response, $status] = $this->client->getParameterValue($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $parameterValueArray = [
            'id' => $response->getParameterValue(),
            'parameter_value' => $response->getParameterValue()->getParameterValue(),
            'parameter_value_code' => $response->getParameterValue()->getParameterValueCode(),
            'attribute1_value' => $response->getParameterValue()->getAttribute1Value(),
            'attribute2_value' => $response->getParameterValue()->getAttribute2Value(),
            'attribute3_value' => $response->getParameterValue()->getAttribute3Value(),
            'attribute4_value' => $response->getParameterValue()->getAttribute4Value(),
            'attribute5_value' => $response->getParameterValue()->getAttribute5Value(),
            'parameter_domain_id' => $response->getParameterValue()->getParameterDomainId(),
            'parameter_definition' => $response->getParameterValue()->getParameterDefinition(),
            'is_active' => $response->getParameterValue()->getIsActive(),
            'sort_priority' => $response->getParameterValue()->getSortPriority(),
            'notes' => $response->getParameterValue()->getNotes(),
        ];
        return GrpcServiceResponse::success($parameterValueArray, $response, $status->code, $status->details);
    }

    // public function listParameterValues(ListParameterValuesRequest $request): ParameterValueProto
    // {
    //     return $this->client->listParameterValues($request);
    // }

    public function deleteParameterValue(int|string $id): GrpcServiceResponse
    {
        $request = new DeleteParameterValueRequest();
        $request->setId((int)$id);

        [$response, $status] = $this->client->deleteParameterValue($request)->wait();

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
