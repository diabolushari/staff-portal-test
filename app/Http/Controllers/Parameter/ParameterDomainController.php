<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterDomainFormRequest;
use App\Services\Grpc\GrpcErrorService;
use Grpc\ChannelCredentials;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Proto\Modules\ListSystemModulesRequest;
use Proto\Modules\SystemModuleServiceClient;
use Proto\Parameters\CreateParameterDomainRequest;
use Proto\Parameters\DeleteParameterDomainRequest;
use Proto\Parameters\GetParameterDomainRequest;
use Proto\Parameters\ListParameterDomainsRequest;
use Proto\Parameters\ParameterDomainProto;
use Proto\Parameters\ParameterDomainServiceClient;
use Proto\Parameters\UpdateParameterDomainRequest;

class ParameterDomainController extends Controller
{
    private $client;

    private $systemModuleClient;

    public function __construct()
    {
        $this->client = new ParameterDomainServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure(),
        ]);
        $this->systemModuleClient = new SystemModuleServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure(),
        ]);
    }

    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);

        $systemModuleReq = new ListSystemModulesRequest;
        $req = new ListParameterDomainsRequest;
        $req->setPage($page);
        $req->setPageSize($pageSize);

        // Fetch domains
        [$res, $status] = $this->client->ListParameterDomains($req)->wait();
        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        // Fetch system modules
        [$systemModuleResponse, $moduleStatus] = $this->systemModuleClient->ListSystemModules($systemModuleReq)->wait();
        if ($moduleStatus->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $moduleStatus->details], 500);
        }

        // Create a map of system module id => name
        $moduleMap = [];
        foreach ($systemModuleResponse->getModules() as $module) {
            $moduleMap[$module->getId()] = $module->getName();
        }

        $domainsArray = [];
        foreach ($res->getDomains() as $domain) {
            $moduleId = $domain->getManagedByModule();
            $moduleName = $moduleMap[$moduleId] ?? 'Unknown';

            $domainsArray[] = [
                'id' => $domain->getId(),
                'domain_name' => $domain->getDomainName(),
                'description' => $domain->getDescription(),
                'domain_code' => $domain->getDomainCode(),
                'managed_by_module' => $moduleId,
                'managed_by_module_name' => $moduleName,
            ];
        }

        return Inertia::render('Parameters/ParameterDomain/ParameterDomainIndex', [
            'domains' => $domainsArray,
        ]);
    }

    public function show($id)
    {
        // Fetch the domain by ID
        $getReq = new GetParameterDomainRequest;
        $getReq->setId($id);

        [$domainRes, $status] = $this->client->GetParameterDomain($getReq)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        $domain = $domainRes;

        // Fetch system modules to map module ID to module name
        $systemModuleReq = new ListSystemModulesRequest;
        [$systemModuleResponse, $moduleStatus] = $this->systemModuleClient->ListSystemModules($systemModuleReq)->wait();

        if ($moduleStatus->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $moduleStatus->details], 500);
        }

        $moduleMap = [];
        foreach ($systemModuleResponse->getModules() as $module) {
            $moduleMap[$module->getId()] = $module->getName();
        }

        $moduleId = $domain->getManagedByModule();
        $moduleName = $moduleMap[$moduleId] ?? 'Unknown';

        // Format data for frontend
        $domainArray = [
            'id' => $domain->getId(),
            'domain_name' => $domain->getDomainName(),
            'description' => $domain->getDescription(),
            'domain_code' => $domain->getDomainCode(),
            'managed_by_module' => $moduleId,
            'managed_by_module_name' => $moduleName,
        ];

        return Inertia::render('Parameters/ParameterDomain/ParameterDomainShow', [
            'domain' => $domainArray,
        ]);
    }

    public function store(ParameterDomainFormRequest $request)
    {

        $domainProto = new ParameterDomainProto;
        $domainProto->setDomainName($request->domainName);
        $domainProto->setDescription($request->description);
        $domainProto->setDomainCode($request->domainCode);
        $domainProto->setManagedByModule($request->managedByModule);
        $req = new CreateParameterDomainRequest;
        $req->setDomain($domainProto);

        [$res, $status] = $this->client->CreateParameterDomain($req)->wait();
        if ($status->code !== 0) { // 0 is STATUS_OK
            $errors = GrpcErrorService::convertToValidationError($status);

            return redirect()->back()->withErrors($errors);
        }

        return redirect()->back()->with(['message' => 'Parameter domain created successfully.']);
    }

    public function update(ParameterDomainFormRequest $request, $id)
    {

        $req = new UpdateParameterDomainRequest;

        $domainProto = new ParameterDomainProto;
        $domainProto->setId($id);
        $domainProto->setDomainName($request->domainName);
        $domainProto->setDescription($request->description);
        $domainProto->setDomainCode($request->domainCode);
        $domainProto->setManagedByModule($request->managedByModule);
        $req->setDomain($domainProto);

        [$res, $status] = $this->client->UpdateParameterDomain($req)->wait();
        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        return redirect()->back()->with([
            'message' => 'Saved successfully',
        ]);
    }

    public function destroy($id)
    {
        $req = new DeleteParameterDomainRequest;
        $req->setId($id);
        [$res, $status] = $this->client->DeleteParameterDomain($req)->wait();
        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        return redirect()->route('parameter-domain.index')->with(['message' => 'deleted successfully']);
    }
}
