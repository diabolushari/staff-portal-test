<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterDefinitionFormRequest;
use GPBMetadata\ParameterDefinition;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Proto\Parameters\ParameterDefinitionServiceClient;
use Grpc\ChannelCredentials;
use Proto\Parameters\CreateParameterDefinitionRequest;
use Proto\Parameters\DeleteParameterDefinitionRequest;
use Proto\Parameters\GetParameterDefinitionRequest;
use Proto\Parameters\ListParameterDefinitionsRequest;
use Proto\Parameters\ListParameterDomainsRequest;
use Proto\Parameters\ParameterDefinitionProto;
use Proto\Parameters\ParameterDomainServiceClient;
use Proto\Parameters\UpdateParameterDefinitionRequest;

class ParameterDefinitionController extends Controller
{
    private $parameterDomainClient;
    private $client;
    public function __construct()
    {
        $this->client = new ParameterDefinitionServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
        $this->parameterDomainClient = new ParameterDomainServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }
    public function index()
    {
        $req = new ListParameterDefinitionsRequest();
        list($res, $status) = $this->client->ListParameterDefinitions($req)->wait();
        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }
        $parameterDefinitions = [];
        $domainMap = [];
        $parameterDomainReq = new ListParameterDomainsRequest();
        list($parameterDomainRes, $parameterDomainStatus) = $this->parameterDomainClient->ListParameterDomains($parameterDomainReq)->wait();
        if ($parameterDomainStatus->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $parameterDomainStatus->details], 500);
        }
        foreach ($parameterDomainRes->getDomains() as $parameterDomain) {
            $domainMap[$parameterDomain->getId()] = $parameterDomain->getDomainName();
        }
        foreach ($res->getDefinitions() as $parameterDefinition) {
            $parameterDefinitions[] = [
                'id' => $parameterDefinition->getId(),
                'parameter_name' => $parameterDefinition->getParameterName(),
                'attribute1_name' => $parameterDefinition->getAttribute1Name(),
                'attribute2_name' => $parameterDefinition->getAttribute2Name(),
                'attribute3_name' => $parameterDefinition->getAttribute3Name(),
                'attribute4_name' => $parameterDefinition->getAttribute4Name(),
                'attribute5_name' => $parameterDefinition->getAttribute5Name(),
                'domain_id' => $parameterDefinition->getDomainId(),
                'domain_name' => $domainMap[$parameterDefinition->getDomainId()],
            ];
        }
        return Inertia::render('Parameters/ParameterDefinition/ParameterDefinitionIndex', [
            'parameterDefinitions' => $parameterDefinitions,
        ]);
    }
    public function create()
    {
        return Inertia::render('Parameters/ParameterDefinition/ParameterDefinitionAction', [
            'data' => null,
        ]);
    }

    public function store(ParameterDefinitionFormRequest $request)
    {

        $req = new CreateParameterDefinitionRequest();

        $definition = new ParameterDefinitionProto();
        $definition->setParameterName($request->parameterName);
        $definition->setAttribute1Name($request->attribute1Name);
        $definition->setAttribute2Name($request->attribute2Name);
        $definition->setAttribute3Name($request->attribute3Name);
        $definition->setAttribute4Name($request->attribute4Name);
        $definition->setAttribute5Name($request->attribute5Name);
        $definition->setIsEffectiveDateDriven($request->isEffectiveDateDriven);
        $definition->setDomainId($request->domainId);

        $req->setDefinition($definition);

        list($res, $status) = $this->client->CreateParameterDefinition($req)->wait();
        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }
        return redirect()->back()->with([
            'message' => 'Parameter definition created successfully',
        ]);
    }

    public function edit($id)
    {
        $req = new GetParameterDefinitionRequest();
        $req->setId($id);
        list($res, $status) = $this->client->GetParameterDefinition($req)->wait();
        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }
        $value = [
            'id' => $res->getId(),
            'parameter_name' => $res->getParameterName(),
            'attribute1_name' => $res->getAttribute1Name(),
            'attribute2_name' => $res->getAttribute2Name(),
            'attribute3_name' => $res->getAttribute3Name(),
            'attribute4_name' => $res->getAttribute4Name(),
            'attribute5_name' => $res->getAttribute5Name(),
            'is_effective_date_driven' => $res->getIsEffectiveDateDriven(),
            'domain_id' => $res->getDomainId(),
        ];
        return Inertia::render('Parameters/ParameterDefinition/ParameterDefinitionAction', [
            'data' => $value,
        ]);
    }

    public function update($id, ParameterDefinitionFormRequest $request)
    {
        $req = new UpdateParameterDefinitionRequest();


        $definition = new ParameterDefinitionProto();
        $definition->setId($id);
        $definition->setParameterName($request->parameterName);
        $definition->setAttribute1Name($request->attribute1Name);
        $definition->setAttribute2Name($request->attribute2Name);
        $definition->setAttribute3Name($request->attribute3Name);
        $definition->setAttribute4Name($request->attribute4Name);
        $definition->setAttribute5Name($request->attribute5Name);
        $definition->setIsEffectiveDateDriven($request->isEffectiveDateDriven);
        $definition->setDomainId($request->domainId);
        $req->setDefinition($definition);
        list($res, $status) = $this->client->UpdateParameterDefinition($req)->wait();
        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }
        return redirect()->back()->with([
            'message' => 'Parameter definition updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $req = new DeleteParameterDefinitionRequest();
        $req->setId($id);
        list($res, $status) = $this->client->DeleteParameterDefinition($req)->wait();
        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }
        return redirect()->back()->with([
            'message' => 'Parameter definition deleted successfully',
        ]);
    }
}
