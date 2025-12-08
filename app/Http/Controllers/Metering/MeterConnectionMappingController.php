<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterConnectionRelFormRequest;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterService;
use Illuminate\Http\RedirectResponse;

class MeterConnectionMappingController extends Controller
{
    public function __construct(
        protected MeterConnectionMappingService $meterConnectionMappingService,
        protected MeterService $meterService,
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(MeterConnectionRelFormRequest $request): RedirectResponse
    {

        $response = $this->meterConnectionMappingService->createMeterConnectionMapping($request);

        if ($response->hasError()) {
            return back()->withErrors(['grpc_error' => $response->error])->withInput();
        }

        return redirect()->route('connections.show', $request->connectionId)->with('message', 'Meter assigned to connection successfully.');
    }

    public function update(MeterConnectionRelFormRequest $request): RedirectResponse
    {

        $response = $this->meterConnectionMappingService->updateMeterConnectionMapping($request);

        if ($response->statusCode != 0) {
            return $response->error ?? redirect()->back();
        }

        return redirect()->route('connections.show', $request->connectionId)->with('success', 'Meter connection details updated successfully.');
    }

    public function destroy(int $relId): RedirectResponse
    {
        $response = $this->meterConnectionMappingService->deleteMeterConnectionMapping($relId);

        if ($response->hasError()) {
            return back()->withErrors(['grpc_error' => $response->error]);
        }

        return redirect()->back()->with('message', 'Meter connection deleted successfully.');
    }
}
