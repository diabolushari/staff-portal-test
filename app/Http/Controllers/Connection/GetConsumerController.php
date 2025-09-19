<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Connection\ConsumerService;
use App\Services\Metering\MeterConnectionRelService;
use App\Services\Metering\MeterService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class GetConsumerController extends Controller
{
    public function __construct(
        private ConsumerService $consumerService,
        private ConnectionService $connectionService,
        private MeterConnectionRelService $meterConnectionRelService,
        private MeterService $meterService,
    ) {}

    public function __invoke(Request $request, int $connectionId): InertiaResponse|RedirectResponse
    {

        $response = $this->consumerService->getConsumer($connectionId);
        $connection = $this->connectionService->getConnection($connectionId);
        $meterConnectionRelResponse = $this->meterConnectionRelService->getMeterConnectionRelByConnectionId($connectionId);
        $meterConnectionRels = $meterConnectionRelResponse->data;
        $meters = [];

        if ($meterConnectionRels !== null) {
            foreach ($meterConnectionRels as $meterConnectionRel) {
                if (isset($meterConnectionRel['meter_id'])) {
                    $meterResponse = $this->meterService->getMeter($meterConnectionRel['meter_id']);
                    if (! $meterResponse->hasError()) {
                        $meters[] = [
                            'relationship' => $meterConnectionRel,
                            'meter' => $meterResponse->data,
                        ];
                    }
                }
            }
        } else {
            $meters = [];
        }
        if ($response->data === null) {
            return redirect()->route('connection.consumer.create', $connectionId);
        }

        return Inertia::render('Consumer/ConsumerShow', [
            'consumer' => $response->data,
            'connection' => $connection->data,
            'meters' => $meters,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
