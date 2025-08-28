<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Parameters\ParameterDefinitionService;
use Illuminate\Http\JsonResponse;

class ParameterDefinitionListApiController extends Controller
{
    public function __construct(
        private readonly ParameterDefinitionService $parameterDefinitionService
    ) {}

    public function __invoke(): JsonResponse | null
    {
        $response = $this->parameterDefinitionService->getParameterDefinitions();

        if ($response->hasError()) {
            return response()->json(['error' => $response->error], 500);
        }

        $definitions = $response->data;

        return response()->json($definitions);
    }
}
