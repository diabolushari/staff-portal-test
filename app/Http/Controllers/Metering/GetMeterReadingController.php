<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GetMeterReadingController extends Controller
{
    public function __construct(private ConnectionService $connectionService) {}

    public function __invoke(Request $request, int $connectionId): Response
    {
        $connection = $this->connectionService->getConnection($connectionId);

        return Inertia::render('MeterReading/MeterReadingCreatePage', [
            'connection' => $connection->data,
        ]);
    }
}
