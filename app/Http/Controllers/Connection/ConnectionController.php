<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\CreateConnectionWithConsumerRequest;
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
        return Inertia::render('Connections/ConnectionsIndex');
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
        ]);
    }

    /**
     * Store a newly created connection and consumer profile in storage.
     */
    public function store(CreateConnectionWithConsumerRequest $request): RedirectResponse
    {

        return redirect()->route('connections.index')->with('success', 'Connection created successfully.');
    }
}
