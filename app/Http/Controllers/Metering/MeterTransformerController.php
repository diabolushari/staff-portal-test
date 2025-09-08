<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterTransformerFormRequest;
use App\Services\Metering\MeterTransformerService;
use Grpc\ChannelCredentials;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Proto\Parameters\ListParameterValuesRequest;
use Proto\Parameters\ParameterValueServiceClient;

class MeterTransformerController extends Controller
{
    protected MeterTransformerService $transformerService;

    private ParameterValueServiceClient $parameterValueClient;

    public function __construct(MeterTransformerService $transformerService)
    {
        $this->transformerService = $transformerService;

        // gRPC client for parameter values
        $this->parameterValueClient = new ParameterValueServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    /**
     * Display a listing of transformers.
     */
    public function index(): Response
    {
        $response = $this->transformerService->listTransformers();

        return Inertia::render('MeterTransformers/MeterTransformerIndex', [
            'transformers' => $response->data,
        ]);
    }

    /**
     * Show the form for creating a transformer (with dropdowns).
     */
    public function create(): Response|RedirectResponse
    {
        $parameterRequests = [
            'ownershipTypes' => (new ListParameterValuesRequest)
                ->setDomainName('Meter Transformer')
                ->setParameterName('Ownership Type'),
            'accuracyClasses' => (new ListParameterValuesRequest)
                ->setDomainName('Meter Transformer')
                ->setParameterName('Accuracy Class'),
            'burdens' => (new ListParameterValuesRequest)
                ->setDomainName('Meter Transformer')
                ->setParameterName('Burden'),
            'makes' => (new ListParameterValuesRequest)
                ->setDomainName('Meter Transformer')
                ->setParameterName('Make'),
            'types' => (new ListParameterValuesRequest)
                ->setDomainName('Meter Transformer')
                ->setParameterName('Type'),
        ];

        $responses = [];
        foreach ($parameterRequests as $key => $request) {
            [$data, $status] = $this->parameterValueClient->ListParameterValues($request)->wait();
            $responses[$key] = ['data' => $data, 'status' => $status];
        }

        // Handle errors
        $errorMessages = [];
        foreach ($responses as $key => $response) {
            if ($response['status']->code !== 0) {
                $errorMessages[] = "Error fetching {$key}: ".$response['status']->details;
            }
        }

        if (! empty($errorMessages)) {
            return redirect()->back()->withErrors([
                'grpc_error' => implode('; ', $errorMessages),
            ]);
        }

        // Format for dropdowns
        $viewData = [];
        foreach ($responses as $key => $response) {
            $viewData[$key] = collect($response['data']->getValues())
                ->map(fn ($item) => [
                    'id' => $item->getId(),
                    'parameterValue' => $item->getParameterValue(),
                ])
            
                ->toArray();
        }

        return Inertia::render('MeterTransformers/MeterTransformerForm', $viewData);
    }

    /**
     * Store a new transformer.
     */
    public function store(MeterTransformerFormRequest $request): RedirectResponse
    {
        $data = $request->toArray();
        $data['created_by'] = auth()->id();

        $response = $this->transformerService->createTransformer($data);

        if ($response->hasError()) {
            return redirect()->back()->withErrors($response->error);
        }

        return redirect()->route('meter-transformers.index')
            ->with('success', 'Meter Transformer created successfully.');
    }

    /**
     * Show a transformer.
     */
    public function show(int $id): Response
    {
        $response = $this->transformerService->getTransformer($id);

        return Inertia::render('MeterTransformers/MeterTransformerShow', [
            'transformer' => $response->data,
        ]);
    }

    /**
     * Delete a transformer.
     */
    public function destroy(int $id): RedirectResponse
    {
        $response = $this->transformerService->deleteTransformer($id);

        if ($response->hasError()) {
            return redirect()->back()->withErrors($response->error);
        }

        return redirect()->route('meter-transformers.index')
            ->with('success', 'Meter Transformer deleted successfully.');
    }
}
