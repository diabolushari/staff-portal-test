<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\CreateConnectionRequest;
use App\Http\Requests\Connections\CreateConnectionWithConsumerRequest;
use App\Http\Requests\Connections\Data\ConnectionData;
use App\Services\Connection\ConnectionService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConnectionController extends Controller
{
    public function __construct(
        private readonly ConnectionService $connectionService,
        private readonly ParameterValueService $parameterValueService
    ) {}

    public function index(Request $request): Response|RedirectResponse
    {
        $connections = $this->connectionService->listConnections();

        return Inertia::render('Connections/ConnectionsIndex', [
            'connections' => $connections->data
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        $connectionTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Type'
        );

        $connectionStatus = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Status'
        );

        $voltageTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Voltage'
        );
        $tariffTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Tariff'
        );
        $connectionCategory = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Category'
        );
        $connectionSubCategory = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Subcategory'
        );

        $billingProcesses = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Billing Process'
        );
        $phaseTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Phase Type'
        );
        $primaryPurposes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Primary Purpose'
        );
        $openAccessTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Open Access Type'
        );
        $meteringTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Metering Type'
        );
        $renewableTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Renewable Type'
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
            'primaryPurposes' => $primaryPurposes->data,
            'openAccessTypes' => $openAccessTypes->data,
            'meteringTypes' => $meteringTypes->data,
            'renewableTypes' => $renewableTypes->data,
        ]);
    }

    /**
     * Store a newly created connection and consumer profile in storage.
     */
    public function store(CreateConnectionRequest $request): RedirectResponse
    {
        $response = $this->connectionService->createConnection($request);

        if ($response->hasError()) {
            return redirect()->back()->with('error', $response->getMessage());
        }
        $connection = $response->data->getConnection();

        return redirect()->route('connection.consumer.create', $connection->getConnectionId());
    }
    public function show(int $id)
    {
        $connection = $this->connectionService->getConnection($id);

        return Inertia::render('Connections/ConnectionsShow', [
            'connection' => $connection->data,
        ]);
    }

    public function edit(int $id)
    {
        $connectionTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Type'
        );

        $connectionStatus = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Status'
        );

        $voltageTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Voltage'
        );
        $tariffTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Tariff'
        );
        $connectionCategory = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Category'
        );
        $connectionSubCategory = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Connection Subcategory'
        );

        $billingProcesses = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Billing Process'
        );
        $phaseTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Phase Type'
        );
        $primaryPurposes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Primary Purpose'
        );
        $openAccessTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Open Access Type'
        );
        $meteringTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Metering Type'
        );
        $renewableTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Renewable Type'
        );

        $connection = $this->connectionService->getConnection($id);


        return Inertia::render('Connections/ConnectionsForm', [
            'connection' => $connection->data,
            'connectionTypes' => $connectionTypes->data,
            'connectionStatus' => $connectionStatus->data,
            'voltageTypes' => $voltageTypes->data,
            'tariffTypes' => $tariffTypes->data,
            'connectionCategory' => $connectionCategory->data,
            'connectionSubCategory' => $connectionSubCategory->data,
            'billingProcesses' => $billingProcesses->data,
            'phaseTypes' => $phaseTypes->data,
            'primaryPurposes' => $primaryPurposes->data,
            'openAccessTypes' => $openAccessTypes->data,
            'meteringTypes' => $meteringTypes->data,
            'renewableTypes' => $renewableTypes->data,
        ]);
    }

    public function update(CreateConnectionRequest $request, int $id)
    {
        $response = $this->connectionService->updateConnection($request, $id);

        if ($response->hasError()) {
            return redirect()->back()->with('error', $response->getMessage());
        }

        return redirect()->route('connections.index')->with('success', 'Connection updated successfully.');
    }
}
