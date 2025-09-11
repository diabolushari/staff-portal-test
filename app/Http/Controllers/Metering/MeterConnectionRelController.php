<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterConnectionRelFormRequest;
use App\Services\Metering\MeterConnectionRelService;

class MeterConnectionRelController extends Controller
{
    public function __construct(protected MeterConnectionRelService $meterConnectionRelService) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(MeterConnectionRelFormRequest $request)
    {
        $meterConnectionRelData = $request->toArray();
        $meterConnectionRelData['created_by'] = auth()->id();

        $response = $this->meterConnectionRelService->createMeterConnectionRel($meterConnectionRelData);

        if ($response->hasError()) {
            return back()->withErrors(['grpc_error' => $response->error])->withInput();
        }

        return redirect()->route('connections.show', ['connection' => $meterConnectionRelData['connection_id']])->with('success', 'Meter assigned to connection successfully.');
    }

    public function update(MeterConnectionRelFormRequest $request)
    {
        $meterConnectionRelData = $request->toArray();
        $meterConnectionRelData['updated_by'] = auth()->id();

        $response = $this->meterConnectionRelService->updateMeterConnectionRel($meterConnectionRelData);

        if ($response->hasError()) {
            return back()->withErrors(['grpc_error' => $response->error])->withInput();
        }

        return redirect()->route('connections.show', ['connection' => $meterConnectionRelData['connection_id']])->with('success', 'Meter connection details updated successfully.');
    }
}
