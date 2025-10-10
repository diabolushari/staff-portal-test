<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterConnectionRelFormRequest;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterService;

class MeterConnectionMappingController extends Controller
{
    public function __construct(
        protected MeterConnectionMappingService $meterConnectionMappingService,
        protected MeterService $meterService,
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(MeterConnectionRelFormRequest $request)
    {

        $response = $this->meterConnectionMappingService->createMeterConnectionMapping($request);

        if ($response->hasError()) {
            return back()->withErrors(['grpc_error' => $response->error])->withInput();
        }

        return redirect()->route('connections.show', ['connection' => $meterConnectionRelData['connection_id']])->with('success', 'Meter assigned to connection successfully.');
    }

    public function update(MeterConnectionRelFormRequest $request)
    {
        $meterConnectionRelData = $request->toArray();
        $meterConnectionRelData['updated_by'] = auth()->id();

        $response = $this->meterConnectionMappingService->updateMeterConnectionMapping($meterConnectionRelData);

        if ($response->hasError()) {
            return back()->withErrors(['grpc_error' => $response->error])->withInput();
        }

        return redirect()->route('connections.show', ['connection' => $meterConnectionRelData['connection_id']])->with('success', 'Meter connection details updated successfully.');
    }

    public function destroy(int $relId)
    {
        $response = $this->meterConnectionMappingService->deleteMeterConnectionMapping($relId);

        if ($response->hasError()) {
            return back()->withErrors(['grpc_error' => $response->error]);
        }

        return redirect()->back()->with('success', 'Meter connection deleted successfully.');
    }
}
