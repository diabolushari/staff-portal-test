<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterDefinitionFormRequest;
use App\Services\Grpc\GrpcErrorService;
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
        if ($status->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($status);
            return redirect()->back()->withErrors($errors);
        }
        $parameterDefinitions = [];
        $domainMap = [];
        $parameterDomainReq = new ListParameterDomainsRequest();
        list($parameterDomainRes, $parameterDomainStatus) = $this->parameterDomainClient->ListParameterDomains($parameterDomainReq)->wait();
        if ($parameterDomainStatus->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($parameterDomainStatus);
            return redirect()->back()->withErrors($errors);
        }
        foreach ($parameterDomainRes->getDomains() as $parameterDomain) {
            $domainMap[$parameterDomain->getId()] = $parameterDomain->getDomainName();
        }
        foreach ($res->getDefinitions() as $parameterDefinition) {
            $parameterDefinitions[] = [
                'id' => $parameterDefinition->getId(),
                'name' => $parameterDefinition->getParameterName(),
                'attribute1' => $parameterDefinition->getAttribute1Name(),
                'attribute2' => $parameterDefinition->getAttribute2Name(),
                'attribute3' => $parameterDefinition->getAttribute3Name(),
                'attribute4' => $parameterDefinition->getAttribute4Name(),
                'attribute5' => $parameterDefinition->getAttribute5Name(),
                'domainId' => $parameterDefinition->getDomainId(),
                'domainName' => $domainMap[$parameterDefinition->getDomainId()],
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
        $definition->setParameterName($request->name);
        $definition->setAttribute1Name($request->attribute1 ?? '');
        $definition->setAttribute2Name($request->attribute2 ?? '');
        $definition->setAttribute3Name($request->attribute3 ?? '');
        $definition->setAttribute4Name($request->attribute4 ?? '');
        $definition->setAttribute5Name($request->attribute5 ?? '');
        $definition->setIsEffectiveDateDriven($request->isEffectiveDateDriven);
        $definition->setDomainId((int)$request->domainId);
        $req->setDefinition($definition);



        list($res, $status) = $this->client->CreateParameterDefinition($req)->wait();
        if ($status->code !== 0) {
            return redirect()->back()->withErrors([
                'message' => 'Parameter definition created failed',
            ]);
        }
        return redirect()->back()->with([
            'message' => 'Parameter definition created successfully',
        ]);
    }

    public function edit($id)
    {
        if (!is_numeric($id) || $id <= 0) {
            return response()->json(['error' => 'Invalid ID parameter'], 400);
        }

        $req = new GetParameterDefinitionRequest();
        $req->setId($id);
        list($res, $status) = $this->client->GetParameterDefinition($req)->wait();
        if ($status->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($status);
            return redirect()->back()->withErrors($errors);
        }
        $value = [
            'id' => $res->getId(),
            'name' => $res->getParameterName(),
            'attribute1' => $res->getAttribute1Name(),
            'attribute2' => $res->getAttribute2Name(),
            'attribute3' => $res->getAttribute3Name(),
            'attribute4' => $res->getAttribute4Name(),
            'attribute5' => $res->getAttribute5Name(),
            'isEffectiveDateDriven' => $res->getIsEffectiveDateDriven(),
            'domainId' => $res->getDomainId(),
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
        $definition->setParameterName($request->name);
        $definition->setAttribute1Name($request->attribute1);
        $definition->setAttribute2Name($request->attribute2);
        $definition->setAttribute3Name($request->attribute3);
        $definition->setAttribute4Name($request->attribute4);
        $definition->setAttribute5Name($request->attribute5);
        $definition->setIsEffectiveDateDriven($request->isEffectiveDateDriven);
        $definition->setDomainId((int)$request->domainId);
        $req->setDefinition($definition);
        list($res, $status) = $this->client->UpdateParameterDefinition($req)->wait();
        if ($status->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($status);
            return redirect()->back()->withErrors($errors);
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
        if ($status->code !== 0) {

            $errors = GrpcErrorService::convertToValidationError($status);
            return redirect()->back()->withErrors($errors);
        }
        return redirect()->back()->with([
            'message' => 'Parameter definition deleted successfully',
        ]);
    }
}
