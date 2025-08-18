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
    private $client;

    public function __construct(
        private ParameterValueService $parameterValueService,
        private ParameterDomainService $parameterDomainService,
        private ParameterDefinitionService $parameterDefinitionService
    ) {}


    public function edit($id)
    {

        $value = $this->parameterValueService->getParameterValue($id);

        return Inertia::render('Parameters/ParameterValue/ParameterValueCreate', [
            'parameter_value' => $value->data
        ]);
    }


    public function index(Request $request)
    {

        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);
        $domainName = $request->input('domain_name');
        $parameterName = $request->input('parameter_name');
        $search = $request->input('search');
        $values = $this->parameterValueService->getParameterValues($page, $pageSize, $search, $domainName, $parameterName);
        $domains = $this->parameterDomainService->getParameterDomains($page, $pageSize, null, null);
        $definitions = $this->parameterDefinitionService->getParameterDefinitions($page, $pageSize, null, null);
        if ($values->hasError()) {
            return $values->error;
        }

        return Inertia::render('Parameters/ParameterValue/ParameterValueIndex', [
            'values' => $values->data,
            'domains' => $domains->data,
            'definitions' => $definitions->data,
            'filters' => [
                'domain_name' => $domainName,
                'parameter_name' => $parameterName,
                'search' => $search,
            ],

        ]);
    }

    public function create()
    {

        return Inertia::render('Parameters/ParameterValue/ParameterValueCreate');
    }

    public function show($id)
    {
        $value = $this->parameterValueService->getParameterValue($id);
        if ($value->hasError()) {
            return $value->error;
        }
        return Inertia::render('Parameters/ParameterValue/ParameterValueShow', [
            'parameter_value' => $value->data
        ]);
    }

    public function store(ParameterValueFormRequest $request)
    {

        $response = $this->parameterValueService->createParameterValue($request);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'Parameter value created successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function update(ParameterValueFormRequest $request, $id)
    {

        $response = $this->parameterValueService->updateParameterValue($request, $id);

        if ($response->hasError()) {
            return $response->error;
        }


        return redirect()->back()->with([
            'message' => 'Parameter value updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function destroy($id)
    {
        $response = $this->parameterValueService->deleteParameterValue($id);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->route('parameter-value.index')->with(['message' => 'Deleted successfully.']);
    }
}
