<?php

namespace App\Http\Controllers\GeneratingStation;

use App\Http\Controllers\Controller;
use App\Http\Requests\GeneratingStation\StationConsumerRelFormRequest;
use App\Services\GeneratingStation\StationConsumerRelService;
use App\Services\Connection\ConnectionService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StationConsumerRelController extends Controller
{
    public function __construct(
        private readonly StationConsumerRelService $stationConsumerRelService,
        private readonly ConnectionService $connectionService,
        private readonly ParameterValueService $parameterValueService,
    ) {}

    /**
     * List station consumers
     */
    public function index(Request $request): Response
    {
        $stationId = $request->input('station_id');

        $response = $this->stationConsumerRelService->listStationConsumers($stationId);

        $consumerTypes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Connection', 'Consumer Type')
            ->data;

        return Inertia::render('GeneratingStation/StationConsumerRel/StationConsumerRelIndex', [
            'relations' => $response->data ?? [],
            'stationId' => $stationId,
            'consumerTypes' => $consumerTypes,
        ]);
    }

    /**
     * Show create form
     */
    public function create(Request $request): Response
    {
        $stationId = $request->input('stationId');
        $stationConnectionId = $request->input('stationConnectionId');

        $stationConnection = $this->connectionService->getConnection($stationConnectionId)->data;

        $consumerTypes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Station Consumer Type', 'Consumer Type')
            ->data;

        return Inertia::render(
            'GeneratingStation/StationConsumerRel/StationConsumerRelCreate',
            [
                'stationId' => $stationId,
                'stationConnection' => $stationConnection,
                'consumerTypes' => $consumerTypes,
            ]
        );
    }

    /**
     * Store new station consumer relation
     */
    public function store(StationConsumerRelFormRequest $request): RedirectResponse
    {
        $response = $this->stationConsumerRelService->create($request);

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()
            ->route('station.consumer-relations', $request->stationId)
            ->with('message', 'Station consumer relation created successfully');
    }

    /**
     * Update priority order
     */
    public function update(Request $request, int $versionId): RedirectResponse
    {
        $response = $this->stationConsumerRelService->updatePriority(
            $versionId,
            $request->stationConnectionId,
            $request->consumerTypeId,
            $request->consumerPriorityOrder,
            $request->stationPriorityOrder
        );

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->back()
            ->with('message', 'Priority updated successfully');
    }

    /**
     * Deactivate relation
     */
    public function destroy(int $versionId): RedirectResponse
    {
        $response = $this->stationConsumerRelService->deactivate($versionId);

        if (! $response->success) {
            return redirect()->back()->with(
                'error',
                $response->error ?? 'Failed to deactivate station consumer relation.'
            );
        }

        return redirect()->back()
            ->with('message', 'Station consumer relation deactivated successfully.');
    }
}