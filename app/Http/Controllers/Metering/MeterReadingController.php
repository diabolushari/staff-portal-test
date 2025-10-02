<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterReadingForm;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterReadingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeterReadingController extends Controller
{
    public function __construct(
        private ConnectionService $connectionService,
        private MeterReadingService $meterReadingService
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

        return redirect()->route('connections.index');
    }

    public function show(int $meteringId, Request $request): Response
    {
        $meterReading = $this->meterReadingService->getMeterReading($meteringId, $request->query('meter_id'));

        return Inertia::render('MeterReading/MeterReadingShowPage', [
            'meterReading' => $meterReading->data,
        ]);
    }
}
