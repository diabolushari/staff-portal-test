<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterReadingForm;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterReadingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeterReadingController extends Controller
{
    public function __construct(
        private ConnectionService $connectionService,
        private MeterReadingService $meterReadingService,
        private MeterConnectionMappingService $meterConnectionMappingService
    ) {}

    public function index(Request $request): Response
    {
        $consumerNumber = $request->input('search') ?? null;
        $connections = $this->connectionService->listConnections($consumerNumber)->data;

        return Inertia::render('MeterReading/MeterReadingIndexPage', [
            'connections' => $connections,
            'filter' => [
                'consumerNumber' => $consumerNumber,
            ],
        ]);
    }

    public function store(MeterReadingForm $request): RedirectResponse
    {
        $response = $this->meterReadingService->createMeterReading($request);
        if ($response->hasError()) {
            if ($response->error) {
                return $response->error;
            } else {
                return redirect()->back()->with('error', 'Failed to get connection');
            }
        }

        if ($request->multipleReading) {
            return redirect()->route('meter-reading.create', $request->connectionId);
        }

        return redirect()->route('connections.index');
    }

    public function show(int $meterReadingId, Request $request): Response
    {
        $connectionId = $request->query('connection_id');
        $connectionRel = null;
        $meterReading = $this->meterReadingService->getMeterReading($meterReadingId, (int) $request->query('meter_id'));
        if ($meterReading->data !== null) {
            $connectionRel = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($meterReading->data['connection_id'])->data;
        }
        $connection = $this->connectionService->getConnection((int) $connectionId)->data;

        return Inertia::render('MeterReading/MeterReadingShowPage', [
            'meterReading' => $meterReading->data,
            'connectionId' => $connectionId,
            'connection' => $connection,
            'meterConnectionMapping' => $connectionRel,
        ]);
    }

    public function update(MeterReadingForm $request, int $meterReadingId): RedirectResponse
    {
        $response = $this->meterReadingService->updateMeterReading($request, $meterReadingId);
        if ($response->hasError()) {
            if ($response->error) {
                return $response->error;
            } else {
                return redirect()->back()->with('error', 'Failed to get connection');
            }
        }

        return redirect()->back()->with('success', 'Meter reading updated successfully');
    }
}
