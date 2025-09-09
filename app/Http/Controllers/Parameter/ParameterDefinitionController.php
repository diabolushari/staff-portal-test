<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterDefinitionFormRequest;
use App\Services\Parameters\ParameterDefinitionService;
use App\Services\Parameters\ParameterDomainService;
use Illuminate\Http\Request;
use Inertia\Inertia;

// TODO: Fix Type Errors
class ParameterDefinitionController extends Controller
{
    public function __construct(
        private ParameterDefinitionService $parameterDefinitionService,
        private ParameterDomainService $parameterDomainService
    ) {}

    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);
        $domainName = $request->input('domain_name');
        $search = $request->input('search');
        $domainsResponse = $this->parameterDomainService->getParameterDomains($page, $pageSize, null, null);
        $response = $this->parameterDefinitionService->getParameterDefinitions($page, $pageSize, $domainName, $search);

        if ($response->hasError()) {
            return $response->error;
        }

        return Inertia::render('Parameters/ParameterDefinition/ParameterDefinitionIndex', [
            'parameter_definitions' => $response->data,
            'domains' => $domainsResponse->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
            'filters' => [
                'domain_name' => $request->input('domain_name'),
                'search' => $request->input('search'),
            ],
        ]);
    }

    public function show($id)
    {
        $response = $this->parameterDefinitionService->getParameterDefinition($id);

        if ($response->hasError()) {
            return $response->error;
        }

        return Inertia::render('Parameters/ParameterDefinition/ParameterDefinitionShow', [
            'definition' => $response->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function store(ParameterDefinitionFormRequest $request)
    {
        $response = $this->parameterDefinitionService->createParameterDefinition($request);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'Parameter definition created successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function update(ParameterDefinitionFormRequest $request, $id)
    {
        $response = $this->parameterDefinitionService->updateParameterDefinition($request, $id);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'Parameter definition updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function destroy($id)
    {
        $response = $this->parameterDefinitionService->deleteParameterDefinition($id);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'Parameter definition deleted successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
