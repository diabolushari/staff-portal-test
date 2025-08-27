<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeterController extends Controller
{
    protected MeterService $meterService;

    public function __construct(MeterService $meterService)
    {
        $this->meterService = $meterService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $response = $this->meterService->listMeters();
        dd($response);

        if ($response->isSuccessful()) {
            return response()->json($response->getData());
        } else {
            return response()->json($response->getErrors(), $response->getStatusCode());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $response = $this->meterService->createMeter($request->all());

        if ($response->isSuccessful()) {
            return response()->json($response->getData(), 201);
        } else {
            return response()->json($response->getErrors(), $response->getStatusCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $response = $this->meterService->getMeter($id);

        if ($response->isSuccessful()) {
            return response()->json($response->getData());
        } else {
            return response()->json($response->getErrors(), $response->getStatusCode());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->all();
        $data['meter_id'] = $id; // Ensure meter_id is in the data for the service
        $response = $this->meterService->updateMeter($data);

        if ($response->isSuccessful()) {
            return response()->json($response->getData());
        } else {
            return response()->json($response->getErrors(), $response->getStatusCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $response = $this->meterService->deleteMeter($id);

        if ($response->isSuccessful()) {
            return response()->json(null, 204);
        } else {
            return response()->json($response->getErrors(), $response->getStatusCode());
        }
    }
}
