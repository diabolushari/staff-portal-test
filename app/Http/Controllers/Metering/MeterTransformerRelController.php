<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterTransformerRelFormRequest;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTransformerRelService;
use App\Services\Metering\MeterTransformerService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class MeterTransformerRelController extends Controller
{
    protected MeterTransformerRelService $relService;

    protected MeterService $meterService;

    protected MeterTransformerService $meterTransformerService;

    public function __construct(
        MeterTransformerRelService $relService,
        MeterService $meterService,
        MeterTransformerService $meterTransformerService,
        ParameterValueService $parameterValueService
    ) {
        $this->relService = $relService;
        $this->meterService = $meterService;
        $this->meterTransformerService = $meterTransformerService;
        $this->parameterValueService = $parameterValueService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $response = $this->relService->listRelations();

        return Inertia::render('MeterTransformerRel/MeterTransformerRelIndex', [
            'relations' => $response->data,
        ]);
    }

    /**
     * Show the form for creating a new relation.
     */
    public function create(): Response|RedirectResponse
    {
        // Fetch dropdowns
        $ctpts = $this->meterTransformerService->listTransformersWithNoRelation();
        $meters = $this->meterService->listMeters();

        $parameterRequests = [
            'statuses' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter CTPT', 'Status')->data,
            'changeReasons' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter CTPT', 'Change Reason')->data,
        ];

        return Inertia::render('MeterTransformerRel/MeterTransformerRelForm', [
            'ctpts' => $ctpts->data,
            'meters' => $meters->data,
            ...$parameterRequests,
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(MeterTransformerRelFormRequest $request): RedirectResponse
    {
        $request->createdBy = auth()->id();
        $response = $this->relService->createRelation($request);

        if ($response->hasError()) {
            return $response->error;
        }

        Log::info('Successfully created MeterTransformerRel:', [
            'data' => $request->toArray(),
            'grpcResponse' => $response,
        ]);

        return redirect()->route('meters.show', $response->data['meter_id'])->with('success', 'Relation created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): Response
    {
        $response = $this->relService->getRelation($id);

        \Log::info('Show relation data:', ['data' => $response->data]);

        return Inertia::render('MeterTransformerRel/MeterTransformerRelShow', [
            'relation' => $response->data,
        ]);
    }

    public function edit(int $id): Response
    {
        $response = $this->relService->getRelation($id);
        $ctpts = $this->meterTransformerService->listTransformersWithNoRelation();
        $meter = $this->meterService->getMeter($response->data['meter_id']);
        $currentCtpt = $this->meterTransformerService->getTransformer($response->data['ctpt_id']);
        $ctptsData = $ctpts->data;

        if ($currentCtpt && ! collect($ctptsData)->contains('meter_ctpt_id', $currentCtpt->data['meter_ctpt_id'])) {
            $ctptsData[] = $currentCtpt->data;
        }
        // Fetch statuses + change reasons

        $parameterRequests = [
            'statuses' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter CTPT', 'Status')->data,
            'changeReasons' => $this->parameterValueService->getParameterValues(1, 100, null, 'Meter CTPT', 'Change Reason')->data,
        ];

        return Inertia::render('MeterTransformerRel/MeterTransformerRelForm', [
            'relation' => $response->data,
            'ctpts' => $ctptsData,
            'meter' => $meter->data,
            ...$parameterRequests,
        ]);
    }

    public function update(MeterTransformerRelFormRequest $request, int $id): RedirectResponse
    {
        $data = $request->toArray();
        $data['updated_by'] = auth()->id(); // Use updated_by, not created_by
        \Log::debug('Update request data:', $data); // Add this line

        // Call updateRelation instead of createRelation
        $response = $this->relService->updateRelation($data, $id);

        if ($response->hasError()) {
            return $response->error;
        }

        \Log::info('Successfully updated MeterTransformerRel:', [
            'id' => $id,
            'data' => $data,
            'grpcResponse' => $response,
        ]);

        return redirect()->route('meters.show', $response->data['meter_id'])->with('success', 'Relation updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $response = $this->relService->deleteRelation($id);

        if ($response->hasError()) {
            return redirect()->back()->withErrors($response->error);
        }

        return redirect()->back()->with('success', 'Relation deleted successfully.');
    }
}
