<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\CreateConnectionFormRequest;
use App\Services\Connection\ConnectionFormItemService;
use App\Services\Connection\ConnectionService;
use App\Services\Connection\ConsumerService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class ConnectionController extends Controller
{
    public function __construct(
        private readonly ConnectionService $connectionService,
        private readonly ParameterValueService $parameterValueService,
        private readonly ConsumerService $consumerService

    ) {}

    public function index(Request $request): Response|RedirectResponse
    {
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 5;
        $consumerNumber = $request->input('search') ?? null;
        $connections = $this->connectionService->listPaginatedConnections($pageNumber, $pageSize, $consumerNumber);
        $paginated = null;
        if (! empty($connections->data)) {
            $paginated = new LengthAwarePaginator(
                $connections->data['connections'],                // items for this page
                $connections->data['total_count'],            // total items count
                $connections->data['page_size'],              // items per page
                $connections->data['page_number'],            // current page
                ['path' => request()->url()]              // so pagination links work properly
            );
        }

        return Inertia::render('Connections/ConnectionsIndex', [
            'connections' => $paginated,
            'filter' => [
                'consumerNumber' => $consumerNumber,
            ],
        ]);
    }

    public function create(): Response|RedirectResponse
    {

        $formItems = (new ConnectionFormItemService($this->parameterValueService))();

        return Inertia::render('Connections/ConnectionsForm', $formItems);
    }

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

        $consumer = $this->consumerService->getConsumer($id);
        $consumerExist = ! $consumer->hasError() && $consumer->data !== null;

        return Inertia::render('Connections/ConnectionsShow', [
            'connection' => $connection->data,
            'consumerExist' => $consumerExist,
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

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->connectionService->deleteConnection($id);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('connections.index')->with('success', 'Connection deleted successfully.');
    }
}
