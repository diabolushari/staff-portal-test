<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Grpc\ChannelCredentials;
use Proto\Parameters\ListParameterDefinitionsRequest;
use Proto\Parameters\ParameterDefinitionServiceClient;

class ParameterDefinitionListApiController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new ParameterDefinitionServiceClient(env('SERVER_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }

    public function __invoke()
    {
        $request = new ListParameterDefinitionsRequest();
        // Optional: you can set pagination here if needed
        // $request->setPage(1);
        // $request->setPageSize(50);

        list($response, $status) = $this->client->ListParameterDefinitions($request)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        $definitions = $response->getDefinitions();
        $definitionArray = [];

        foreach ($definitions as $definition) {
            $definitionArray[] = [
                'id' => $definition->getId(),
                'domain_id' => $definition->getDomainId(),
                'is_effective_date_driven' => $definition->getIsEffectiveDateDriven(),
                'parameter_name' => $definition->getParameterName(),
                'attribute1_name' => $definition->getAttribute1Name(),
                'attribute2_name' => $definition->getAttribute2Name(),
                'attribute3_name' => $definition->getAttribute3Name(),
                'attribute4_name' => $definition->getAttribute4Name(),
                'attribute5_name' => $definition->getAttribute5Name(),
            ];
        }

        return response()->json($definitionArray);
    }
}
