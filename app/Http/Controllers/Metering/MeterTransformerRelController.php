<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterTransformerRelFormRequest;
use App\Services\Metering\MeterTransformerRelService;
use App\Services\Metering\MeterTransformerService;
use App\Services\Metering\MeterService;
use Grpc\ChannelCredentials;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Proto\Parameters\ListParameterValuesRequest;
use Proto\Parameters\ParameterValueServiceClient;
use Illuminate\Support\Facades\Log;

class MeterTransformerRelController extends Controller
{
    protected MeterTransformerRelService $relService;
    protected MeterService $meterService;
      protected MeterTransformerService $meterTransformerService; 
    private ParameterValueServiceClient $parameterValueClient;

    public function __construct(
        MeterTransformerRelService $relService,
        MeterService $meterService,
        MeterTransformerService $meterTransformerService
    ) {
        $this->relService = $relService;
        $this->meterService = $meterService;
        $this->meterTransformerService = $meterTransformerService;

        // gRPC client for parameter values
        $this->parameterValueClient = new ParameterValueServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
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
        $ctpts = $this->meterTransformerService->listTransformers(); // gRPC call for CT/PT list
        $meters = $this->meterService->listMeters(); // gRPC call for meters

        $parameterRequests = [
            'statuses' => (new ListParameterValuesRequest)
                ->setDomainName('MeterTransformerRel')
                ->setParameterName('Status'),
            'changeReasons' => (new ListParameterValuesRequest)
                ->setDomainName('MeterTransformerRel')
                ->setParameterName('Change Reason'),
        ];

        $responses = [];
        foreach ($parameterRequests as $key => $request) {
            [$data, $status] = $this->parameterValueClient->ListParameterValues($request)->wait();
            $responses[$key] = ['data' => $data, 'status' => $status];
        }

        $errorMessages = [];
        foreach ($responses as $key => $response) {
            if ($response['status']->code !== 0) {
                $errorMessages[] = "Error fetching {$key}: ".$response['status']->details;
            }
        }
        if (!empty($errorMessages)) {
            return redirect()->back()->withErrors([
                'grpc_error' => implode('; ', $errorMessages),
            ]);
        }

        $viewData = [];
        foreach ($responses as $key => $response) {
            $viewData[$key] = collect($response['data']->getValues())
                ->map(fn($item) => [
                    'id' => $item->getId(),
                    'parameterValue' => $item->getParameterValue(),
                ])
                ->toArray();
        }

        return Inertia::render('MeterTransformerRel/MeterTransformerRelForm', [
            'ctpts' => $ctpts->data,
            'meters' => $meters->data,
            ...$viewData,
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(MeterTransformerRelFormRequest $request): RedirectResponse
    {
        $data = $request->toArray();
        $data['created_by'] = auth()->id();

        if (empty($data['effective_start_ts'])) {
        $data['effective_start_ts'] = now()->toISOString();
        }
        //$request->setEffectiveStartTs($this->toProtoTimestamp($data['effective_start_ts']));


        $response = $this->relService->createRelation($data);

        if ($response->hasError()) {
            return $response->error;
        }

         Log::info('Successfully created MeterTransformerRel:', [
        'data' => $data,
        'grpcResponse' => $response,
    ]);

        return redirect()->route('meter-rel.index')->with('success', 'Relation created successfully.');
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
            $ctpts = $this->meterTransformerService->listTransformers();
            $meters = $this->meterService->listMeters();

            // Fetch statuses + change reasons (same as create)
            $parameterRequests = [
                'statuses' => (new ListParameterValuesRequest)
                    ->setDomainName('MeterTransformerRel')
                    ->setParameterName('Status'),
                'changeReasons' => (new ListParameterValuesRequest)
                    ->setDomainName('MeterTransformerRel')
                    ->setParameterName('Change Reason'),
            ];

            $responses = [];
            foreach ($parameterRequests as $key => $request) {
                [$data, $status] = $this->parameterValueClient->ListParameterValues($request)->wait();
                $responses[$key] = ['data' => $data, 'status' => $status];
            }

            $viewData = [];
            foreach ($responses as $key => $res) {
                $viewData[$key] = collect($res['data']->getValues())
                    ->map(fn($item) => [
                        'id' => $item->getId(),
                        'parameterValue' => $item->getParameterValue(),
                    ])
                    ->toArray();
            }

            return Inertia::render('MeterTransformerRel/MeterTransformerRelForm', [
                'relation'      => $response->data,      
                'ctpts'         => $ctpts->data,         
                'meters'        => $meters->data,        
                'statuses'      => $viewData['statuses'],
                'changeReasons' => $viewData['changeReasons'],
            ]);
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

        return redirect()->route('meter-rel.index')->with('success', 'Relation deleted successfully.');
    }
}
