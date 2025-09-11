<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterTimezoneTypeRelService;
use Illuminate\Http\Request;

class MeterTimezoneTypeRelController extends Controller
{
    protected MeterTimezoneTypeRelService $meterTimezoneTypeRelService;

    public function __construct(MeterTimezoneTypeRelService $meterTimezoneTypeRelService)
    {
        $this->meterTimezoneTypeRelService = $meterTimezoneTypeRelService;
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['created_by'] = auth()->id();

        $response = $this->meterTimezoneTypeRelService->createMeterTimezoneTypeRel($data);

        if ($response->hasError()) {
            return back()->withErrors(['grpc_error' => $response->error->message]);
        }

        return redirect()->back()->with('success', 'Timezone type relation created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $data = $request->all();
        $data['rel_id'] = $id;
        $data['updated_by'] = auth()->id();

        $response = $this->meterTimezoneTypeRelService->updateMeterTimezoneTypeRel($data);

        if ($response->hasError()) {
            return back()->withErrors(['grpc_error' => $response->error->message]);
        }

        return redirect()->back()->with('success', 'Timezone type relation updated successfully.');
    }
}
