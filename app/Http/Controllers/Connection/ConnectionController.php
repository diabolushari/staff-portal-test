<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\CreateConnectionFormRequest;

use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionRelService;
use App\Services\Metering\MeterService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConnectionController extends Controller
{
    public function __construct(
        private readonly ConnectionService $connectionService,
        private readonly ParameterValueService $parameterValueService,
        private readonly MeterConnectionRelService $meterConnectionRelService,
        private readonly MeterService $meterService
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
    public function store(CreateConnectionFormRequest $request): RedirectResponse
    {
        $response = $this->connectionService->createConnection($request);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to create connection');
        }
        $connection = $response->data;

        return redirect()->route('connection.consumer.create', $connection['connection_id']);
    }
    public function show(int $id): Response|RedirectResponse
    {
        $connection = $this->connectionService->getConnection($id);
        if ($connection->hasError()) {
            if ($connection->error) {
                return $connection->error;
            } else {
                return redirect()->back()->with('error', 'Failed to get connection');
            }
        }

        $meterConnectionRelResponse = $this->meterConnectionRelService->getMeterConnectionRelByConnectionId($id);

        $meterConnectionRel = $meterConnectionRelResponse->data;
        $meter = null;

        if ($meterConnectionRel && isset($meterConnectionRel['meter_id'])) {
            $meterResponse = $this->meterService->getMeter($meterConnectionRel['meter_id']);
            if (!$meterResponse->hasError()) {
                $meter = $meterResponse->data;
            }
        }

        return Inertia::render('Connections/ConnectionsShow', [
            'connection' => $connection->data,
            'meterConnectionRel' => $meterConnectionRel,
            'meter' => $meter,
        ]);
    }

    public function edit(int $id): Response|RedirectResponse
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

    public function update(CreateConnectionFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->connectionService->updateConnection($request, $id);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->route('connections.index')->with('success', 'Connection updated successfully.');
    }
}
