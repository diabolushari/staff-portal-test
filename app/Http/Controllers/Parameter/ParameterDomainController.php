<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parameters\ParameterDomainFormRequest;
use App\Services\Parameters\ParameterDomainService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParameterDomainController extends Controller
{
    public function __construct(private ParameterDomainService $parameterDomainService) {}

    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);

        $response = $this->parameterDomainService->getParameterDomains(
            $page,
            $pageSize,
            $request->input('search'),
            $request->input('module_id')
        );

        if ($response->hasError()) {
            return $response->error;
        }

        return Inertia::render('Parameters/ParameterDomain/ParameterDomainIndex', [
            'domains' => $response->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function show($id)
    {
        $response = $this->parameterDomainService->getParameterDomain($id);

        if ($response->hasError()) {
            return $response->error;
        }

        return $response->data;

        return Inertia::render('Parameters/ParameterDomain/ParameterDomainShow', [
            'domain' => $response->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function store(ParameterDomainFormRequest $request)
    {
        $response = $this->parameterDomainService->createParameterDomain($request);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'Parameter domain created successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function update(ParameterDomainFormRequest $request, $id)
    {
        $response = $this->parameterDomainService->updateParameterDomain($request, $id);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'Parameter domain updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function destroy($id)
    {
        $response = $this->parameterDomainService->deleteParameterDomain($id);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'Parameter domain deleted successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
