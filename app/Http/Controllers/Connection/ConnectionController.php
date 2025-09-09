<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\CreateConnectionFormRequest;
use App\Services\Connection\ConnectionFormItemService;
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
            'connections' => $connections->data,
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        $formItems = (new ConnectionFormItemService($this->parameterValueService))();

        return Inertia::render('Connections/ConnectionsForm', $formItems);
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

        return Inertia::render('Connections/ConnectionsShow', [
            'connection' => $connection->data,
        ]);
    }

    public function edit(int $id): Response|RedirectResponse
    {

        $connection = $this->connectionService->getConnection($id);

        return Inertia::render('Connections/ConnectionsForm', [
            'connection' => $connection->data,
            ...(new ConnectionFormItemService($this->parameterValueService))(),
        ]);
    }

    public function update(CreateConnectionFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->connectionService->updateConnection($request, $id);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('connections.index')->with('success', 'Connection updated successfully.');
    }
}
