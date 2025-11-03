<?php

namespace App\Http\Controllers\MeterReading;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Metering\MeterReadingService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class GetMeterReadingWithConnectionController extends Controller
{
    public function __construct(
        private ConnectionService $connectionService,
        private MeterReadingService $meterReadingService,
    ) {}

    public function __invoke(Request $request, int $connectionId): Response
    {

        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 5;
        $search = $request->input('search') ?? null;
        $connection = $this->connectionService->getConnection($connectionId);
        $meterReadingResponse = $this->meterReadingService->listPaginatedMeterReadings($pageNumber, $pageSize, $search, $connectionId);
        $paginated = null;
        if (! empty($meterReadingResponse->data['data'])) {
            $paginated = new LengthAwarePaginator(
                $meterReadingResponse->data['data'],                // items for this page
                $meterReadingResponse->data['total_count'],            // total items count
                $meterReadingResponse->data['page_size'],              // items per page
                $meterReadingResponse->data['page_number'],            // current page
                ['path' => request()->url()]              // so pagination links work properly
            );
        }

        return Inertia::render('MeterReading/ConnectionMeterReadingPage', [
            'connection' => $connection->data,
            'meters' => $connection->data['meters'] ?? [],
            'meterReadings' => $paginated,
        ]);

    }
}
