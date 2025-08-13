<?php

namespace App\Services\Parameters;

use App\Http\Requests\Parameters\ParameterDefinitionFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Parameters\ParameterDefinitionServiceClient;
use Proto\Parameters\ParameterDefinitionProto;
use Proto\Parameters\CreateParameterDefinitionRequest;
use Proto\Parameters\UpdateParameterDefinitionRequest;
use Proto\Parameters\DeleteParameterDefinitionRequest;
use Proto\Parameters\GetParameterDefinitionRequest;
use Proto\Parameters\ListParameterDefinitionsRequest;

class ParameterDefinitionService
{
    private ParameterDefinitionServiceClient $client;

    public function __construct()
    {
        $this->client = new ParameterDefinitionServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function getParameterDefinitions(int $page = 1, int $pageSize = 10): GrpcServiceResponse
    {
        $request = new ListParameterDefinitionsRequest();
        $request->setPage($page);
        $request->setPageSize($pageSize);

        [$response, $status] = $this->client->ListParameterDefinitions($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $definitionsArray = [];
        foreach ($response->getDefinitions() as $def) {
            $definitionsArray[] = [
                'id' => $def->getId(),
                'parameter_name' => $def->getParameterName(),
                'attribute1_name' => $def->getAttribute1Name(),
                'attribute2_name' => $def->getAttribute2Name(),
                'attribute3_name' => $def->getAttribute3Name(),
                'attribute4_name' => $def->getAttribute4Name(),
                'attribute5_name' => $def->getAttribute5Name(),
                'is_effective_date_driven' => $def->getIsEffectiveDateDriven(),
                'domain_id' => $def->getDomainId(),
            ];
        }

        return GrpcServiceResponse::success($definitionsArray, $response, $status->code, $status->details);
    }

    public function getParameterDefinition(string|int $id): GrpcServiceResponse
    {
        $request = new GetParameterDefinitionRequest();
        $request->setId($id);

        [$response, $status] = $this->client->GetParameterDefinition($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $definition = [
            'id' => $response->getId(),
            'parameter_name' => $response->getParameterName(),
            'attribute1_name' => $response->getAttribute1Name(),
            'attribute2_name' => $response->getAttribute2Name(),
            'attribute3_name' => $response->getAttribute3Name(),
            'attribute4_name' => $response->getAttribute4Name(),
            'attribute5_name' => $response->getAttribute5Name(),
            'is_effective_date_driven' => $response->getIsEffectiveDateDriven(),
            'domain_id' => $response->getDomainId(),
        ];

        return GrpcServiceResponse::success($definition, $response, $status->code, $status->details);
    }

    public function createParameterDefinition(ParameterDefinitionFormRequest $request): GrpcServiceResponse
    {
        $proto = new ParameterDefinitionProto();
        $proto->setParameterName($request->parameterName);
        $proto->setAttribute1Name($request->attribute1Name);
        $proto->setAttribute2Name($request->attribute2Name);
        $proto->setAttribute3Name($request->attribute3Name);
        $proto->setAttribute4Name($request->attribute4Name);
        $proto->setAttribute5Name($request->attribute5Name);
        $proto->setIsEffectiveDateDriven($request->isEffectiveDateDriven);
        $proto->setDomainId($request->domainId);

        $grpcRequest = new CreateParameterDefinitionRequest();
        $grpcRequest->setDefinition($proto);

        [$response, $status] = $this->client->CreateParameterDefinition($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $parameterDefinitionArray = [
            'id' => $response->getId(),
            'parameter_name' => $response->getParameterName(),
            'attribute1_name' => $response->getAttribute1Name(),
            'attribute2_name' => $response->getAttribute2Name(),
            'attribute3_name' => $response->getAttribute3Name(),
            'attribute4_name' => $response->getAttribute4Name(),
            'attribute5_name' => $response->getAttribute5Name(),
            'is_effective_date_driven' => $response->getIsEffectiveDateDriven(),
            'domain_id' => $response->getDomainId(),
        ];

        return GrpcServiceResponse::success($parameterDefinitionArray, $response, $status->code, $status->details);
    }

    public function updateParameterDefinition(ParameterDefinitionFormRequest $request, string|int $id): GrpcServiceResponse
    {
        $proto = new ParameterDefinitionProto();
        $proto->setId($id);
        $proto->setParameterName($request->parameterName);
        $proto->setAttribute1Name($request->attribute1Name);
        $proto->setAttribute2Name($request->attribute2Name);
        $proto->setAttribute3Name($request->attribute3Name);
        $proto->setAttribute4Name($request->attribute4Name);
        $proto->setAttribute5Name($request->attribute5Name);
        $proto->setIsEffectiveDateDriven($request->isEffectiveDateDriven);
        $proto->setDomainId($request->domainId);

        $grpcRequest = new UpdateParameterDefinitionRequest();
        $grpcRequest->setDefinition($proto);

        [$response, $status] = $this->client->UpdateParameterDefinition($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $parameterDefinitionArray = [
            'id' => $response->getId(),
            'parameter_name' => $response->getParameterName(),
            'attribute1_name' => $response->getAttribute1Name(),
            'attribute2_name' => $response->getAttribute2Name(),
            'attribute3_name' => $response->getAttribute3Name(),
            'attribute4_name' => $response->getAttribute4Name(),
            'attribute5_name' => $response->getAttribute5Name(),
            'is_effective_date_driven' => $response->getIsEffectiveDateDriven(),
            'domain_id' => $response->getDomainId(),
        ];

        return GrpcServiceResponse::success($parameterDefinitionArray, $response, $status->code, $status->details);
    }

    public function deleteParameterDefinition(string|int $id): GrpcServiceResponse
    {
        $grpcRequest = new DeleteParameterDefinitionRequest();
        $grpcRequest->setId($id);

        [$response, $status] = $this->client->DeleteParameterDefinition($grpcRequest)->wait();

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
