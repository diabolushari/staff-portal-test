<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterValueFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterDefinitionService;
use App\Services\Parameters\ParameterDomainService;
use App\Services\Parameters\ParameterValueService;
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

    public function __construct(
        private ParameterValueService $parameterValueService,
        private ParameterDomainService $parameterDomainService,
        private ParameterDefinitionService $parameterDefinitionService
    ) {}


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
        $values = $this->parameterValueService->getParameterValues($page, $pageSize, null, null);
        $domains = $this->parameterDomainService->getParameterDomains($page, $pageSize, null, null);
        $definitions = $this->parameterDefinitionService->getParameterDefinitions($page, $pageSize, null, null);

        return Inertia::render('Parameters/ParameterValue/ParameterValueIndex', [
            'values' => $values->data,
            'domains' => $domains->data,
            'definitions' => $definitions->data,
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
