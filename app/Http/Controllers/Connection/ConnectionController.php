<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\CreateConnectionWithConsumerRequest;
use App\Services\Connection\ConnectionService;
use App\Services\Parameters\ParameterValueService;
use Grpc\ChannelCredentials;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    public function index(Request $request): Response|RedirectResponse
    {
        return Inertia::render('Connections/ConnectionsIndex');
    }

    public function create(ParameterValueService $parameterValueService): Response|RedirectResponse
    {
        // Example: Fetching 'Connection Type' and 'Consumer Type' for dropdowns.
        // You would repeat this pattern for all other '_id' fields.

        $connectionTypes = $parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Type'
        );

        $connectionStatus = $parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Status'
        );

        $voltageTypes = $parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Voltage'
        );
        $tariffTypes = $parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Tariff'
        );
        $connectionCategory = $parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Category'
        );
        $connectionSubCategory = $parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Subcategory'
        );

        $billingProcesses = $parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Billing Process'
        );
        $phaseTypes = $parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Phase Type'
        );


        return Inertia::render('Connections/ConnectionsForm', [
            'connectionTypes' => $connectionTypes->data,
            'connectionStatus' => $connectionStatus->data,
            'voltageTypes' => $voltageTypes->data,
            'tariffTypes' => $tariffTypes->data,
            'connectionCategory' => $connectionCategory->data,
            'connectionSubCategory' => $connectionSubCategory->data,
            'billingProcesses' => $billingProcesses->data,
            'phaseTypes' => $phaseTypes->data,
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
