<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Connection\ConsumerService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GetMeterReadingController extends Controller
{
    public function __construct(
        private ConnectionService $connectionService,
        private ParameterValueService $parameterService,
        private ConsumerService $consumerService
    ) {}

    public function __invoke(Request $request, int $connectionId): Response
    {
        $meterHealthTypes = $this->parameterService->getParameterValues(1,
            100,
            null,
            'Meter',
            'Meter Health',
        );
        $ctptHealthTypes = $this->parameterService->getParameterValues(1,
            100,
            null,
            'Meter',
            'Meter CTPT Health',
        );

        $anomalyTypes = $this->parameterService->getParameterValues(1,
            100,
            null,
            'Meter',
            'Anomalies',
        );
        $connection = $this->connectionService->getConnection($connectionId);
        $consumer = $this->consumerService->getConsumer($connectionId);

        return Inertia::render('MeterReading/MeterReadingCreatePage', [
            'connectionWithConsumer' => [
                'connection' => $connection->data,
                'consumer' => $consumer->data['consumer'] ?? null,
            ],
            'meterHealthTypes' => $meterHealthTypes->data,
            'ctptHealthTypes' => $ctptHealthTypes->data,
            'anomalyTypes' => $anomalyTypes->data,
        ]);
    }
}
