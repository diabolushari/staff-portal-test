<?php

namespace App\Http\Controllers\GeneratingStation;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\GeneratingStation\GeneratingStationService;

class StationTransactionController extends Controller
{
    public function __construct(
        private GeneratingStationService $service
    ) {}

    public function index($stationId)
    {
        $transactions =
            $this->service->listStationTransactions($stationId);
             $station = $this->service->getGeneratingStation($stationId);

       return Inertia::render(
        'GeneratingStation/StationTransactionPage',
            [
                'transactions' => $transactions->data,
                'station' => $station->data,
                'stationId' => $stationId
            ]
);
    }
}
