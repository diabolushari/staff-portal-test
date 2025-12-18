<?php

namespace App\Http\Controllers\MeterProfileParameter;

use App\Http\Controllers\Controller;
use App\Http\Requests\MeterProfileParameter\MeterProfileParameterFormRequest;
use App\Services\Metering\MeteringParameterProfileService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeterProfileParameterController extends Controller
{

    public function __construct(
        private MeteringParameterProfileService $meterProfileParameterService,
        private ParameterValueService $parameterValueService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request):Response|RedirectResponse
    {
        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);

        $search = $request->input('search');
        $moduleId = $request->input('module_id') ? (int) $request->input('module_id') : null;

        $response = $this->meterProfileParameterService->listMeteringProfileParameters(
            $page,
            $pageSize,
            $search,
            $moduleId
        );

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch Meter Profile Parameter.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

       

        return Inertia::render('MeterProfileParameter/MeterProfileParameterIndex', [
            'meterProfileParameters' => $response->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
            'oldSearch'=>$request->input('search'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create():Response
    {

        $profiles= $this->parameterValueService->getParameterValues(null,null,null,'Meter','Meter Profile');

        return Inertia::render('MeterProfileParameter/MeterProfileParameterCreate', [
            'profiles' => $profiles->data,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MeterProfileParameterFormRequest $request): RedirectResponse
    {
        $response = $this->meterProfileParameterService->createMeterProfileParameter($request);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to create meter profile parameter.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->route('meter-profile-parameter.index')->with([
            'message' => 'Meter profile parameter created successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,  
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id):Response|RedirectResponse
    {
        $response = $this->meterProfileParameterService->getMeterProfileParameter($id);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to fetch meter profile parameter.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        $profiles= $this->parameterValueService->getParameterValues(null,null,null,'Meter','Meter Profile');

        return Inertia::render('MeterProfileParameter/MeterProfileParameterCreate', [
            'profiles' => $profiles->data,
            'meterProfileParameter' => $response->data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MeterProfileParameterFormRequest $request, int $meterParameterId): RedirectResponse
    {
        $response = $this->meterProfileParameterService->updateMeterProfileParameter($request, $meterParameterId);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->with([
                'message' => 'Failed to update meter profile parameter.',
                'grpcStatus' => [
                    'code' => $response->statusCode,
                    'details' => $response->statusDetails,
                ],
            ]);
        }

        return redirect()->route('meter-profile-parameter.index')->with([
            'message' => 'Meter profile parameter updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,  
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
