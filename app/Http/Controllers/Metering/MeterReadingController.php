<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeterReadingController extends Controller
{
    public function __construct(private ConnectionService $connectionService) {}

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
}
