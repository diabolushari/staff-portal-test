<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Proto\Parameters\ParameterDefinitionServiceClient;
use Grpc\ChannelCredentials;
use Proto\Parameters\GetParameterDefinitionRequest;

class ParameterDefinitionItemApiController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new ParameterDefinitionServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }

    public function __invoke($id)
    {
        $req = new GetParameterDefinitionRequest();
        $req->setId($id);

        list($res, $status) = $this->client->GetParameterDefinition($req)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        $parameter = $res;


        return response()->json([
            'id' => $parameter->getId(),
            'domain_id' => $parameter->getDomainId(),
            'parameter_name' => $parameter->getParameterName(),
            'is_effective_date_driven' => $parameter->getIsEffectiveDateDriven(),
            'attribute1_name' => $parameter->getAttribute1Name(),
            'attribute2_name' => $parameter->getAttribute2Name(),
            'attribute3_name' => $parameter->getAttribute3Name(),
            'attribute4_name' => $parameter->getAttribute4Name(),
            'attribute5_name' => $parameter->getAttribute5Name(),
        ]);
    }
}
