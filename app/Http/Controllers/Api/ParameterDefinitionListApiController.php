<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Grpc\ChannelCredentials;
use Proto\Parameters\ListParameterDefinitionsRequest;
use Proto\Parameters\ParameterDefinitionServiceClient;

// TODO create service
// TODO Fix Type Errors
class ParameterDefinitionListApiController extends Controller
{
    private $client;

    public function __construct()
    {
        // TODO dont use env
        $this->client = new ParameterDefinitionServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure(),
        ]);
    }

    public function __invoke()
    {
        $request = new ListParameterDefinitionsRequest;
        // Optional: you can set pagination here if needed
        // $request->setPage(1);
        // $request->setPageSize(50);

        [$response, $status] = $this->client->ListParameterDefinitions($request)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        $definitions = $response->getDefinitions();
        $definitionArray = [];

        foreach ($definitions as $definition) {
            $definitionArray[] = [
                'id' => $definition->getId(),
                'domainId' => $definition->getDomainId(),
                'isEffectiveDateDriven' => $definition->getIsEffectiveDateDriven(),
                'parameterName' => $definition->getParameterName(),
                'attribute1' => $definition->getAttribute1Name(),
                'attribute2' => $definition->getAttribute2Name(),
                'attribute3' => $definition->getAttribute3Name(),
                'attribute4' => $definition->getAttribute4Name(),
                'attribute5' => $definition->getAttribute5Name(),
            ];
        }

        return response()->json($definitionArray);
    }
}
