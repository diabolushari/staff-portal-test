<?php

namespace App\Http\Controllers\MeteringTimezone;

use App\Http\Controllers\Controller;
use App\Services\MeteringTimezone\MeteringTimezoneService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MeteringTimezoneController extends Controller
{
    protected MeteringTimezoneService $meteringTimezoneService;
    protected ParameterValueService $parameterValueService;

    public function __construct(
        MeteringTimezoneService $meteringTimezoneService,
        ParameterValueService $parameterValueService
    ) {
        $this->meteringTimezoneService = $meteringTimezoneService;
        $this->parameterValueService = $parameterValueService;
    }

    /**
     * Display a listing of the meter timezones.
     */
    public function index(): Response|RedirectResponse
    {
        $response = $this->meteringTimezoneService->listMeteringTimezones();

        if ($response->hasError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching timezones: ' . ($response->statusDetails ?? 'Unknown error')
            ]);
        }

        return Inertia::render('MeteringTimezones/MeteringTimezoneIndexPage', [
            'timezones' => $response->data,
        ]);
    }

    /**
     * Show the form for creating a new meter timezone.
     */
    public function create(): Response|RedirectResponse
    {
        // Fetch all required parameter values for the form
        $pricingTypesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Pricing Type'
        );

        $timezoneTypesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Timezone Type'
        );

        $timezoneNamesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Timezone Name'
        );

        // Check for errors in any of the responses
        if ($pricingTypesResponse->hasError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching Pricing Types: ' . ($pricingTypesResponse->statusDetails ?? 'Unknown error'),
            ]);
        }

        if ($timezoneTypesResponse->hasError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching Timezone Types: ' . ($timezoneTypesResponse->statusDetails ?? 'Unknown error'),
            ]);
        }

        if ($timezoneNamesResponse->hasError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching Timezone Names: ' . ($timezoneNamesResponse->statusDetails ?? 'Unknown error'),
            ]);
        }

        // Transform the responses to the required format
        $pricingTypes = collect($pricingTypesResponse->data)
            ->map(fn($item) => [
                'id' => $item['id'],
                'parameterValue' => $item['parameter_value'],
            ])
            ->toArray();

        $timezoneTypes = collect($timezoneTypesResponse->data)
            ->map(fn($item) => [
                'id' => $item['id'],
                'parameterValue' => $item['parameter_value'],
            ])
            ->toArray();

        $timezoneNames = collect($timezoneNamesResponse->data)
            ->map(fn($item) => [
                'id' => $item['id'],
                'parameterValue' => $item['parameter_value'],
            ])
            ->toArray();

        return Inertia::render('MeteringTimezones/MeteringTimezoneFormPage', [
            'pricingTypes' => $pricingTypes,
            'timezoneTypes' => $timezoneTypes,
            'timezoneNames' => $timezoneNames,
        ]);
    }

    /**
     * Store a newly created meter timezone.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->all();
        $data['created_by'] = auth()->id();

        $response = $this->meteringTimezoneService->createMeteringTimezone($data);

        if ($response->hasError()) {
            return redirect()->back()->withErrors($response->error)->withInput();
        }

        return redirect()->route('metering-timezone.index')->with('success', 'Meter timezone created successfully.');
    }

    /**
     * Display the specified meter timezone.
     */
    public function show(int $id): Response|RedirectResponse
    {
        $timezone = $this->meteringTimezoneService->getMeteringTimezone($id);

        if ($timezone->hasError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching timezone: ' . ($timezone->statusDetails ?? 'Unknown error')
            ]);
        }

        return Inertia::render('MeteringTimezones/MeteringTimezoneShowPage', [
            'timezone' => $timezone->data,
        ]);
    }

    /**
     * Show the form for editing the specified meter timezone.
     */
    public function edit(int $id): Response|RedirectResponse
    {
        $timezone = $this->meteringTimezoneService->getMeteringTimezone($id);

        if ($timezone->hasError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching timezone: ' . ($timezone->statusDetails ?? 'Unknown error')
            ]);
        }

        // Fetch all required parameter values for the form
        $pricingTypesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Pricing Type'
        );

        $timezoneTypesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Timezone Type'
        );

        $timezoneNamesResponse = $this->parameterValueService->getParameterValues(
            page: 1,
            pageSize: 100,
            search: null,
            domainName: 'Meter',
            parameterName: 'Timezone Name'
        );

        // Check for errors in any of the responses
        if ($pricingTypesResponse->hasError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching Pricing Types: ' . ($pricingTypesResponse->statusDetails ?? 'Unknown error'),
            ]);
        }

        if ($timezoneTypesResponse->hasError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching Timezone Types: ' . ($timezoneTypesResponse->statusDetails ?? 'Unknown error'),
            ]);
        }

        if ($timezoneNamesResponse->hasError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching Timezone Names: ' . ($timezoneNamesResponse->statusDetails ?? 'Unknown error'),
            ]);
        }

        // Transform the responses to the required format
        $pricingTypes = collect($pricingTypesResponse->data)
            ->map(fn($item) => [
                'id' => $item['id'],
                'parameterValue' => $item['parameter_value'],
            ])
            ->toArray();

        $timezoneTypes = collect($timezoneTypesResponse->data)
            ->map(fn($item) => [
                'id' => $item['id'],
                'parameterValue' => $item['parameter_value'],
            ])
            ->toArray();

        $timezoneNames = collect($timezoneNamesResponse->data)
            ->map(fn($item) => [
                'id' => $item['id'],
                'parameterValue' => $item['parameter_value'],
            ])
            ->toArray();

        return Inertia::render('MeteringTimezones/MeteringTimezoneFormPage', [
            'timezone' => $timezone->data,
            'pricingTypes' => $pricingTypes,
            'timezoneTypes' => $timezoneTypes,
            'timezoneNames' => $timezoneNames,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified meter timezone.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $request->all();
        $data['metering_timezone_id'] = $id;
        $data['updated_by'] = auth()->id();

        $response = $this->meteringTimezoneService->updateMeteringTimezone($data);

        if ($response->hasError()) {
            return redirect()->back()->withErrors($response->error)->withInput();
        }

        return redirect()->route('metering-timezone.index')->with('success', 'Meter timezone updated successfully.');
    }

    /**
     * Remove the specified meter timezone.
     */
    public function destroy(int $id): RedirectResponse
    {
        $response = $this->meteringTimezoneService->deleteMeteringTimezone($id);

        if ($response->hasError()) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error deleting timezone: ' . ($response->statusDetails ?? 'Unknown error')
            ]);
        }

        return redirect()->route('metering-timezone.index')->with('success', 'Meter timezone deleted successfully.');
    }

    /**
     * Get meter timezones by pricing type.
     */
    public function getByPricingType(int $pricingTypeId): \Illuminate\Http\JsonResponse
    {
        $response = $this->meteringTimezoneService->getMeteringTimezonesByPricingType($pricingTypeId);

        if ($response->hasError()) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching timezones',
                'error' => $response->error
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $response->data
        ]);
    }
}
