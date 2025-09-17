<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterDefinitionFormRequest;
use App\Services\Parameters\ParameterDefinitionService;
use App\Services\Parameters\ParameterDomainService;
use App\Services\SystemModule\SystemModuleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

// TODO: Fix Type Errors
class ParameterDefinitionController extends Controller
{
    public function __construct(
        private ParameterDefinitionService $parameterDefinitionService,
        private ParameterDomainService $parameterDomainService,
        private SystemModuleService $systemModuleService
    ) {}

    public function index(Request $request): InertiaResponse|RedirectResponse
    {
        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);
        $domainName = $request->input('domain_name');
        $moduleName = $request->input('module_name');
        $search = $request->input('search');
        $domainsResponse = $this->parameterDomainService->getParameterDomains($page, $pageSize, null, null);
        $systemModulesResponse = $this->systemModuleService->getSystemModules($page, $pageSize);
        $response = $this->parameterDefinitionService->getParameterDefinitions($page, $pageSize, $domainName, $moduleName, $search);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch parameter definitions.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return Inertia::render('Parameters/ParameterDefinition/ParameterDefinitionIndex', [
            'parameter_definitions' => $response->data,
            'domains' => $domainsResponse->data,
            'system_modules' => $systemModulesResponse->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
            'filters' => [
                'module_name' => $request->input('module_name'),
                'domain_name' => $request->input('domain_name'),
                'search' => $request->input('search'),
            ],
        ]);
    }

    public function show(int|string $id): InertiaResponse|RedirectResponse
    {
        $response = $this->parameterDefinitionService->getParameterDefinition($id);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch parameter definition.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return Inertia::render('Parameters/ParameterDefinition/ParameterDefinitionShow', [
            'definition' => $response->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function store(ParameterDefinitionFormRequest $request): RedirectResponse
    {
        $response = $this->parameterDefinitionService->createParameterDefinition($request);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to create parameter definition.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->route('parameter-definition.index')->with([
            'message' => 'Parameter definition created successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function update(ParameterDefinitionFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->parameterDefinitionService->updateParameterDefinition($request, $id);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to update parameter definition.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->route('parameter-definition.index')->with([
            'message' => 'Parameter definition updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->parameterDefinitionService->deleteParameterDefinition($id);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to delete parameter definition.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->route('parameter-definition.index')->with([
            'message' => 'Parameter definition deleted successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
