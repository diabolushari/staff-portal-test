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

        $search = $request->input('search') ?? null;
        $connectionId = $request->input('connection_id') ?? null;
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;

        $meterReadings = $this->meterReadingService->listPaginatedMeterReadings(
            pageNumber: (int)$pageNumber,
            pageSize: (int)$pageSize,
            search: $search,
            connectionId: $connectionId
        );
        if ($meterReadings->hasError()) {
            return $meterReadings->error ?? redirect()->back()->withErrors([
                'message' => $meterReadings->statusDetails ?? 'Error fetching meter readings',
            ]);
        }
        $paginated = null;
        if (! empty($meterReadings->data)) {
            $paginated = new LengthAwarePaginator(
                $meterReadings->data['readings'],                // items for this page
                $meterReadings->data['total_count'],            // total items count
                $meterReadings->data['page_size'],              // items per page
                $meterReadings->data['page_number'],            // current page
                ['path' => request()->url()]              // so pagination links work properly
            );
        }


        return Inertia::render('MeterReading/MeterReadingIndexPage', [
            'connections' => $connections,
            'meterReadings' => $paginated,
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
        $meterReading = $this->meterReadingService->getMeterReading($meterReadingId, (int) $request->query('meter_id'));

        return Inertia::render('MeterReading/MeterReadingShowPage', [
            'meterReading' => $meterReading->data,
            'connectionId' => $connectionId,
        ]);
    }
}
