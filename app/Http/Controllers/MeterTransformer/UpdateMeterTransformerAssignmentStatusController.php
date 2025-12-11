<?php

namespace App\Http\Controllers\MeterTransformer;

use App\Http\Controllers\Controller;
use App\Services\Metering\MeterTransformerRelService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Proto\Metering\MeterTransformerRelServiceClient;

class UpdateMeterTransformerAssignmentStatusController extends Controller
{
     public function __invoke(Request $request,MeterTransformerRelService $meterTransformerRelService):RedirectResponse
    {
        $request->validate([
            'status_id' => 'required',
            'faulty_date' => 'required',
            'ctpt_version_id'=> 'required',
        ]);



        $response = $meterTransformerRelService->updateRelationStatus($request->all());

        if ($response->hasError()) {
            return redirect()->back()->with('error', $response->error ?? 'Something went wrong');
        }

        return redirect()->back()->with('message', 'Meter Transformer status updated Successfully');
    }
}
