<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterFormRequest;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTimezoneTypeRelService;
use Grpc\ChannelCredentials;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Proto\Parameters\ListParameterValuesRequest;
use Proto\Parameters\ParameterValueServiceClient;

class MeterController extends Controller
{
    protected MeterService $meterService;

    protected MeterTimezoneTypeRelService $meterTimezoneTypeRelService;

    private ParameterValueServiceClient $parameterValueClient;

    public function __construct(MeterService $meterService, MeterTimezoneTypeRelService $meterTimezoneTypeRelService)
    {
        $this->meterService = $meterService;
        $this->meterTimezoneTypeRelService = $meterTimezoneTypeRelService;

        // Manually instantiate the gRPC client for Parameter Values.
        $this->parameterValueClient = new ParameterValueServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $response = $this->meterService->listMeters();

        return Inertia::render('Meters/MeterIndex', [
            'meters' => $response->data,
        ]);
    }

    /**
     * Show the form for creating a new meter, populated with dropdown data.
     */
    public function create(): Response|RedirectResponse
    {
        // Define all the parameter requests needed for the form's dropdowns.
        $parameterRequests = [
            'ownershipTypes' => (new ListParameterValuesRequest)
                ->setDomainName('Meter')
                ->setParameterName('Ownership Type'),
            'makes' => (new ListParameterValuesRequest)
                ->setDomainName('Meter')
                ->setParameterName('Make'),
            'types' => (new ListParameterValuesRequest)
                ->setDomainName('Meter')
                ->setParameterName('Type'),
            'categories' => (new ListParameterValuesRequest)
                ->setDomainName('Meter')
                ->setParameterName('Category'),
            'accuracyClasses' => (new ListParameterValuesRequest)
                ->setDomainName('Meter')
                ->setParameterName('Accuracy Class'),
            'phases' => (new ListParameterValuesRequest)
                ->setDomainName('Meter')
                ->setParameterName('Phase'),
            'dialingFactors' => (new ListParameterValuesRequest)
                ->setDomainName('Meter')
                ->setParameterName('Dialing Factor'),
            'units' => (new ListParameterValuesRequest)
                ->setDomainName('Meter')
                ->setParameterName('Unit'),
            'resetTypes' => (new ListParameterValuesRequest)
                ->setDomainName('Meter')
                ->setParameterName('Reset Type'),
            'internalPtRatios' => (new ListParameterValuesRequest)
                ->setDomainName('Meter')
                ->setParameterName('Internal PT Ratio'),
            'internalCtRatios' => (new ListParameterValuesRequest)
                ->setDomainName('Meter')
                ->setParameterName('Internal CT Ratio'),
        ];

        // Execute all gRPC requests and store their responses.
        $responses = [];
        foreach ($parameterRequests as $key => $request) {
            [$data, $status] = $this->parameterValueClient->ListParameterValues($request)->wait();
            $responses[$key] = ['data' => $data, 'status' => $status];
        }

        // Check for any errors in the responses.
        $errorMessages = [];
        foreach ($responses as $key => $response) {
            if ($response['status']->code !== 0) {
                $errorMessages[] = "Error fetching {$key}: ".$response['status']->details;
            }
        }

        // If any errors were found, redirect back with the details.
        if (! empty($errorMessages)) {
            return redirect()->back()->withErrors([
                'grpc_error' => implode('; ', $errorMessages),
            ]);
        }

        // If all calls were successful, format the data for the view.
        $viewData = [];
        foreach ($responses as $key => $response) {
            $viewData[$key] = collect($response['data']->getValues())
                ->map(fn ($item) => [
                    'id' => $item->getId(),
                    'parameterValue' => $item->getParameterValue(),
                ])
                ->toArray();
        }

        // Render the Inertia component and pass the formatted data as props.
        return Inertia::render('Meters/MeterForm', $viewData);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MeterFormRequest $request)
    {

        $meterDataArray = $request->toArray();
        $meterDataArray['created_by'] = auth()->id();

        $response = $this->meterService->createMeter($meterDataArray);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->route('meters.index')->with('success', 'Meter created successful');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $response = $this->meterService->getMeter($id);

        $currentTimezone = $this->meterTimezoneTypeRelService->getActiveMeterTimezoneTypeRelByMeterId($id);

        // Fetch Timezone Types
        $timezoneTypesRequest = (new ListParameterValuesRequest)
            ->setDomainName('Meter')
            ->setParameterName('Timezone Type');

        [$timezoneTypesData, $timezoneTypesStatus] = $this->parameterValueClient->ListParameterValues($timezoneTypesRequest)->wait();

        if ($timezoneTypesStatus->code !== 0) {
            return redirect()->back()->withErrors([
                'grpc_error' => 'Error fetching Timezone Types: '.$timezoneTypesStatus->details,
            ]);
        }

        $timezoneTypes = collect($timezoneTypesData->getValues())
            ->map(fn ($item) => [
                'id' => $item->getId(),
                'parameterValue' => $item->getParameterValue(),
            ])
            ->toArray();

        if ($currentTimezone->data == null) {
            return Inertia::render('Meters/MeterShow', [
                'meter' => $response->data,
                'currentTimezone' => null,
                'timezoneTypes' => $timezoneTypes,
            ]);

        }

        return Inertia::render('Meters/MeterShow', [
            'meter' => $response->data,
            'currentTimezone' => $currentTimezone->data,
            'timezoneTypes' => $timezoneTypes,
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    /* public function update(Request $request, int $id): JsonResponse */
    /* { */
    /*     $data = $request->all(); */
    /*     $data['meter_id'] = $id; // Ensure meter_id is in the data for the service */
    /*     $response = $this->meterService->updateMeter($data); */
    /**/
    /*     if ($response->isSuccessful()) { */
    /*         return response()->json($response->getData()); */
    /*     } else { */
    /*         return response()->json($response->getErrors(), $response->getStatusCode()); */
    /*     } */
    /* } */

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $response = $this->meterService->deleteMeter($id);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->route('meters.index')->with('success', 'Meter deleted successfully.');
    }
}
