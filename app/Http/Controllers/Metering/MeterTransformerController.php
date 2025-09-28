<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterTransformerFormRequest;
use App\Services\Metering\MeterTransformerRelService;
use App\Services\Metering\MeterTransformerService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MeterTransformerController extends Controller
{
    public function __construct(
        private readonly MeterTransformerService $transformerService,
        private readonly MeterTransformerRelService $transformerRelService,
        private readonly ParameterValueService $parameterValueService
    ) {}

    /**
     * Display a listing of transformers.
     */
    public function index(): Response
    {
        $response = $this->transformerService->listTransformers();

        return Inertia::render('MeterTransformers/MeterTransformerIndex', [
            'transformers' => $response->data,
        ]);
    }

    /**
     * Show the form for creating a transformer (with dropdowns).
     */
    public function create(): Response|RedirectResponse
    {
        $parameterRequests = [
            'ownershipTypes' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Ownership Type')->data,
            'accuracyClasses' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter', 'Accuracy Class')->data,
            'burdens' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter CTPT', 'Burden')->data,
            'makes' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter CTPT', 'Make')->data,
            'types' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter CTPT', 'Type')->data,
        ];

        return Inertia::render('MeterTransformers/MeterTransformerForm', $parameterRequests);
    }

    /**
     * Store a new transformer.
     */
    public function store(MeterTransformerFormRequest $request): RedirectResponse
    {
        $data = $request->toArray();
        $data['created_by'] = auth()->id();

        $response = $this->transformerService->createTransformer($data);

        if ($response->hasError()) {
            return redirect()->back()->withErrors($response->error);
        }

        return redirect()->route('meter-ctpt.index')
            ->with('success', 'Meter Transformer created successfully.');
    }

    /**
     * Show a transformer.
     */
    public function show(int $id): Response
    {
        $response = $this->transformerService->getTransformer($id);
        $relation = $this->transformerRelService->getRelByCtptId($id);

        return Inertia::render('MeterTransformers/MeterTransformerShow', [
            'transformer' => $response->data ?? null,
            'relation' => $relation->data,
        ]);
    }

    /**
     * Delete a transformer.
     */
    public function destroy(int $id): RedirectResponse
    {
        $response = $this->transformerService->deleteTransformer($id);

        if ($response->hasError()) {
            return redirect()->back()->withErrors($response->error);
        }

        return redirect()->route('meter-ctpt.index')
            ->with('success', 'Meter Transformer deleted successfully.');
    }
}
