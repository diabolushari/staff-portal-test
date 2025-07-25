<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterValueFormRequest;
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

class ParameterValueController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new ParameterValueServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }


    public function edit($id)
    {

        $req = new GetParameterValueRequest();
        $req->setId($id);

        list($res, $status) = $this->client->GetParameterValue($req)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        $value = [
            'id' => $res->getId(),
            'parameter_code' => $res->getParameterCode(),
            'parameter_value' => $res->getParameterValue(),
            'definition_id' => $res->getDefinitionId(),
            'parent_id' => $res->getParentId(),
            'attribute1_value' => $res->getAttribute1Value(),
            'attribute2_value' => $res->getAttribute2Value(),
            'attribute3_value' => $res->getAttribute3Value(),
            'attribute4_value' => $res->getAttribute4Value(),
            'attribute5_value' => $res->getAttribute5Value(),
            'effective_start_date' => $res->getEffectiveStartDate(),
            'effective_end_date' => $res->getEffectiveEndDate(),
            'is_active' => $res->getIsActive(),
            'sort_priority' => $res->getSortPriority(),
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

        $req = new ListParameterValuesRequest();
        $req->setPage($page);
        $req->setPageSize($pageSize);

        list($res, $status) = $this->client->ListParameterValues($req)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        $values = [];
        foreach ($res->getValues() as $value) {
            $values[] = [
                'id' => $value->getId(),
                'parameter_code' => $value->getParameterCode(),
                'parameter_value' => $value->getParameterValue(),
                'definition_id' => $value->getDefinitionId(),
                'attribute1_value' => $value->getAttribute1Value(),
                'attribute2_value' => $value->getAttribute2Value(),
                'attribute3_value' => $value->getAttribute3Value(),
                'attribute4_value' => $value->getAttribute4Value(),
                'attribute5_value' => $value->getAttribute5Value(),
                'effective_start_date' => $value->getEffectiveStartDate(),
                'effective_end_date' => $value->getEffectiveEndDate(),
                'is_active' => $value->getIsActive(),
                'sort_priority' => $value->getSortPriority(),
                'notes' => $value->getNotes(),
            ];
        }

        return Inertia::render('Parameters/ParameterValue/ParameterValueIndex', [
            'values' => $values
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

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        $value = [
            'id' => $res->getId(),
            'parameter_code' => $res->getParameterCode(),
            'parameter_value' => $res->getParameterValue(),
            'definition_id' => $res->getDefinitionId(),
            'parent_id' => $res->getParentId(),
            'attribute1_value' => $res->getAttribute1Value(),
            'attribute2_value' => $res->getAttribute2Value(),
            'attribute3_value' => $res->getAttribute3Value(),
            'attribute4_value' => $res->getAttribute4Value(),
            'attribute5_value' => $res->getAttribute5Value(),
            'effective_start_date' => $res->getEffectiveStartDate(),
            'effective_end_date' => $res->getEffectiveEndDate(),
            'is_active' => $res->getIsActive(),
            'sort_priority' => $res->getSortPriority(),
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
        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
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
        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        return redirect()->back()->with(['message' => 'Parameter value updated successfully.']);
    }

    public function destroy($id)
    {
        $req = new DeleteParameterValueRequest();
        $req->setId($id);

        list($res, $status) = $this->client->DeleteParameterValue($req)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        return redirect()->route('parameter-value.index')->with(['message' => 'Deleted successfully.']);
    }
}
