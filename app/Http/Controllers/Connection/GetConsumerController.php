<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Connection\ConsumerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class GetConsumerController extends Controller
{
    public function __construct(
        private ConsumerService $consumerService,
        private ConnectionService $connectionService,
    ) {}

    public function __invoke(Request $request, int $Id): InertiaResponse|RedirectResponse
    {

        $response = $this->consumerService->getConsumer($Id);
        $connection = $this->connectionService->getConnection($Id);

        if ($response->data === null) {
            Log::info('reached here');
            return redirect()->route('connection.consumer.create', $Id);
        }


        return Inertia::render('Consumer/ConsumerShow', [
            'consumer' => $response->data,
            'connection' => $connection->data,
        ]);
    }
}
