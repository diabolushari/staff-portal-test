<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterValueFormRequest;
use App\Services\Grpc\GrpcErrorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Proto\Parameters\ParameterValueProto;
use Proto\Parameters\ParameterValueServiceClient;
use Proto\Parameters\CreateParameterValueRequest;
use Proto\Parameters\UpdateParameterValueRequest;
use Proto\Parameters\GetParameterValueRequest;
use Proto\Parameters\DeleteParameterValueRequest;
use Proto\Parameters\ListParameterValuesRequest;

use Grpc\ChannelCredentials;
use Proto\Parameters\ListParameterDefinitionsRequest;
use Proto\Parameters\ListParameterDomainsRequest;
use Proto\Parameters\ParameterDefinitionServiceClient;
use Proto\Parameters\ParameterDomainServiceClient;

class ParameterValueController extends Controller
{
    private $parameterDefinitionClient;
    private $client;
    private $parameterDomainClient;

    public function __construct()
    {
        $this->parameterDefinitionClient = new ParameterDefinitionServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
        $this->client = new ParameterValueServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
        $this->parameterDomainClient = new ParameterDomainServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }


    public function edit($id)
    {

        $req = new GetParameterValueRequest();
        $req->setId($id);

        list($res, $status) = $this->client->GetParameterValue($req)->wait();

        if ($status->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($status);
            return redirect()->back()->withErrors($errors);
        }

        $value = [
            'id' => $res->getId(),
            'parameterCode' => $res->getParameterCode(),
            'parameterValue' => $res->getParameterValue(),
            'definitionId' => $res->getDefinitionId(),
            'parentId' => $res->getParentId(),
            'attribute1Value' => $res->getAttribute1Value(),
            'attribute2Value' => $res->getAttribute2Value(),
            'attribute3Value' => $res->getAttribute3Value(),
            'attribute4Value' => $res->getAttribute4Value(),
            'attribute5Value' => $res->getAttribute5Value(),
            'effectiveStartDate' => $res->getEffectiveStartDate(),
            'effectiveEndDate' => $res->getEffectiveEndDate(),
            'is_active' => $res->getIsActive(),
            'sortPriority' => $res->getSortPriority(),
            'notes' => $res->getNotes(),
        ];

        return Inertia::render('Parameters/ParameterValue/ParameterValueCreate', [
            'data' => $value
        ]);
    }


    public function index(Request $request)
    {

        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);
        $requestDomainName = $request->input('domainName');
        $requestDefentionName = $request->input('defenitionName');

        $parameterDomainRequest = new ListParameterDomainsRequest();
        [$parameterDomainResponse, $parameterDomainStatus] = $this->parameterDomainClient
            ->ListParameterDomains($parameterDomainRequest)
            ->wait();

        if ($parameterDomainStatus->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($parameterDomainStatus);
            return redirect()->back()->withErrors($errors);
        }


        $domains = [];
        foreach ($parameterDomainResponse->getDomains() as $domain) {
            $domains[] = json_decode($domain->serializeToJsonString(), true);
        }


        $definitionMap = [];
        $definitions = [];

        $defReq = new ListParameterDefinitionsRequest();
        [$defRes, $defStatus] = $this->parameterDefinitionClient
            ->ListParameterDefinitions($defReq)
            ->wait();

        if ($defStatus->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($defStatus);
            return redirect()->back()->withErrors($errors);
        }

        foreach ($defRes->getDefinitions() as $definition) {
            $defArr = json_decode($definition->serializeToJsonString(), true);
            $definitions[] = $defArr;

            // Store name by ID for lookup
            $definitionMap[$defArr['id']] = $defArr['definition_name'] ?? '—';
        }

        // 3. Fetch Parameter Values

        $req = new ListParameterValuesRequest();
        $req->setPage($page);
        $req->setPageSize($pageSize);
        $req->setDomainName($requestDomainName);
        $req->setParameterName($requestDefentionName);

        [$res, $status] = $this->client->ListParameterValues($req)->wait();

        if ($status->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($status);
            return redirect()->back()->withErrors($errors);
        }

        // 4. Map values with definition name
        $values = [];
        $res->getValues();


        foreach ($res->getValues() as $value) {
            $definitionId = $value->getDefinitionId();
            $definitionName = $definitionMap[$definitionId] ?? '—';

            $values[] = [
                'id' => $value->getId(),
                'parameterCode' => $value->getParameterCode(),
                'parameterValue' => $value->getParameterValue(),
                'definitionId' => $definitionId,
                'definitionName' => $definitionName,
                'attribute1Value' => $value->getAttribute1Value(),
                'attribute2Value' => $value->getAttribute2Value(),
                'attribute3Value' => $value->getAttribute3Value(),
                'attribute4Value' => $value->getAttribute4Value(),
                'attribute5Value' => $value->getAttribute5Value(),
                'effective_start_date' => $value->getEffectiveStartDate(),
                'effective_end_date' => $value->getEffectiveEndDate(),
                'is_active' => $value->getIsActive(),
                'sortPriority' => $value->getSortPriority(),
                'notes' => $value->getNotes(),
            ];
        }

        // 5. Return all data to the frontend
        return Inertia::render('Parameters/ParameterValue/ParameterValueIndex', [
            'values' => $values,
            'domains' => $domains,
            'definitions' => $definitions,
            'filters' => [
                'domainName' => $request->input('domainName'),
                'defenitionName' => $request->input('defenitionName'),
            ],

        ]);
    }

    public function create()
    {

        return Inertia::render('Parameters/ParameterValue/ParameterValueCreate');
    }

    public function show($id)
    {
        $req = new GetParameterValueRequest();
        $req->setId($id);

        list($res, $status) = $this->client->GetParameterValue($req)->wait();

        if ($status->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($status);
            return redirect()->back()->withErrors($errors);
        }

        $value = [
            'id' => $res->getId(),
            'parameterCode' => $res->getParameterCode(),
            'parameterValue' => $res->getParameterValue(),
            'definitionId' => $res->getDefinitionId(),
            'parentId' => $res->getParentId(),
            'attribute1Value' => $res->getAttribute1Value(),
            'attribute2Value' => $res->getAttribute2Value(),
            'attribute3Value' => $res->getAttribute3Value(),
            'attribute4Value' => $res->getAttribute4Value(),
            'attribute5Value' => $res->getAttribute5Value(),
            'effectiveStartDate' => $res->getEffectiveStartDate(),
            'effectiveEndDate' => $res->getEffectiveEndDate(),
            'is_active' => $res->getIsActive(),
            'sortPriority' => $res->getSortPriority(),
            'notes' => $res->getNotes(),
        ];

        return Inertia::render('Parameters/ParameterValue/ParameterValueShow', [
            'data' => $value
        ]);
    }

    public function store(ParameterValueFormRequest $request)
    {
        if (!$request->effectiveStartDate) {
            $request->effectiveStartDate = date('Y-m-d');
        }
        $proto = new ParameterValueProto();
        $proto->setParameterCode($request->parameterCode);
        $proto->setParameterValue($request->parameterValue);
        $proto->setDefinitionId($request->definitionId);
        $proto->setParentId($request->parentParameterValue ?? 0);
        $proto->setAttribute1Value($request->attribute1Value ?? '');
        $proto->setAttribute2Value($request->attribute2Value ?? '');
        $proto->setAttribute3Value($request->attribute3Value ?? '');
        $proto->setAttribute4Value($request->attribute4Value ?? '');
        $proto->setAttribute5Value($request->attribute5Value ?? '');
        $proto->setEffectiveStartDate($request->effectiveStartDate);
        $proto->setEffectiveEndDate($request->effectiveEndDate ?? '');
        $proto->setIsActive($request->isActive ?? true);
        $proto->setSortPriority($request->sortPriority ?? 0);
        $proto->setNotes($request->notes ?? '');

        $req = new CreateParameterValueRequest();
        $req->setValue($proto);

        list($res, $status) = $this->client->CreateParameterValue($req)->wait();
        if ($status->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($status);
            return redirect()->back()->withErrors($errors);
        }

        return redirect()->back()->with(['message' => 'Parameter value created successfully.']);
    }

    public function update(ParameterValueFormRequest $request, $id)
    {
        if (!$request->effectiveStartDate) {
            $request->effectiveStartDate = date('Y-m-d');
        }
        $proto = new ParameterValueProto();
        $proto->setId($id);
        $proto->setParameterCode($request->parameterCode);
        $proto->setParameterValue($request->parameterValue);
        $proto->setDefinitionId($request->definitionId);
        $proto->setParentId($request->parentParameterValue ?? 0);
        $proto->setAttribute1Value($request->attribute1Value ?? '');
        $proto->setAttribute2Value($request->attribute2Value ?? '');
        $proto->setAttribute3Value($request->attribute3Value ?? '');
        $proto->setAttribute4Value($request->attribute4Value ?? '');
        $proto->setAttribute5Value($request->attribute5Value ?? '');
        $proto->setEffectiveStartDate($request->effectiveStartDate);
        $proto->setEffectiveEndDate($request->effectiveEndDate ?? '');
        $proto->setIsActive($request->isActive ?? true);
        $proto->setSortPriority($request->sortPriority ?? 0);
        $proto->setNotes($request->notes ?? '');

        $req = new UpdateParameterValueRequest();
        $req->setValue($proto);

        list($res, $status) = $this->client->UpdateParameterValue($req)->wait();
        if ($status->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($status);
            return redirect()->back()->withErrors($errors);
        }

        return redirect()->back()->with(['message' => 'Parameter value updated successfully.']);
    }

    public function destroy($id)
    {
        $req = new DeleteParameterValueRequest();
        $req->setId($id);

        list($res, $status) = $this->client->DeleteParameterValue($req)->wait();

        if ($status->code !== 0) {
            $errors = GrpcErrorService::convertToValidationError($status);
            return redirect()->back()->withErrors($errors);
        }

        return redirect()->route('parameter-value.index')->with(['message' => 'Deleted successfully.']);
    }
}
