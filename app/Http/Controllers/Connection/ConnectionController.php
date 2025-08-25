<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\CreateConnectionWithConsumerRequest;
use App\Services\Connection\ConnectionService;
use Grpc\ChannelCredentials;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Proto\Parameters\ListParameterValuesRequest;
use Proto\Parameters\ParameterValueServiceClient;

class ConnectionController extends Controller
{
    private ConnectionService $connectionService;

    private ParameterValueServiceClient $parameterValueClient;

    public function __construct(ConnectionService $connectionService)
    {
        $this->connectionService = $connectionService;

        // Instantiate the client for fetching dropdown/parameter data
        $this->parameterValueClient = new ParameterValueServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    /**
     * Show the form for creating a new connection.
     * This method fetches all necessary data for dropdowns.
     */
    public function create(): Response|RedirectResponse
    {
        // Example: Fetching 'Connection Type' and 'Consumer Type' for dropdowns.
        // You would repeat this pattern for all other '_id' fields.
        $connTypeRequest = new ListParameterValuesRequest([
            'domain_name' => 'Connections',
            'parameter_name' => 'Connection Type',
        ]);
        $consumerTypeRequest = new ListParameterValuesRequest([
            'domain_name' => 'Connections',
            'parameter_name' => 'Consumer Type',
        ]);

        [$connTypesResponse, $connStatus] = $this->parameterValueClient->ListParameterValues($connTypeRequest)->wait();
        [$consumerTypesResponse, $consumerStatus] = $this->parameterValueClient->ListParameterValues($consumerTypeRequest)->wait();

        if ($connStatus->code !== 0 || $consumerStatus->code !== 0) {
            return redirect()->back()->withErrors([
                'grpc_error' => $connStatus->details ?: $consumerStatus->details,
            ]);
        }

        $connectionTypes = collect($connTypesResponse->getValues())
            ->map(fn ($item) => ['id' => $item->getId(), 'parameterValue' => $item->getParameterValue()])
            ->toArray();

        $consumerTypes = collect($consumerTypesResponse->getValues())
            ->map(fn ($item) => ['id' => $item->getId(), 'parameterValue' => $item->getParameterValue()])
            ->toArray();

        return Inertia::render('Connections/ConnectionForm', [
            'connectionTypes' => $connectionTypes,
            'consumerTypes' => $consumerTypes,
            // ...pass other dropdown data here
        ]);
    }

    /**
     * Store a newly created connection and consumer profile in storage.
     */
    public function store(CreateConnectionWithConsumerRequest $request): RedirectResponse
    {
        // Set the 'created_by' field from the authenticated user
        $request->connection->createdBy = auth()->id();
        $request->consumerProfile->createdBy = auth()->id();

        $response = $this->connectionService->createConnectionWithConsumer($request);

        if ($response->hasError()) {
            // The GrpcServiceResponse should format the error as a RedirectResponse
            return $response->error;
        }

        // Assuming you have an index route for connections
        return redirect()->route('connections.index')->with('success', 'Connection created successfully.');
    }
}
