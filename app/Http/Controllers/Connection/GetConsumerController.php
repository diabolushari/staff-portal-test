<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConsumerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GetConsumerController extends Controller
{
    public function __construct(
        private ConsumerService $connectionService,
    ) {}
    public function __invoke(Request $request, int $connectionId)
    {

        $response = $this->connectionService->getConsumer($connectionId);


        if ($response->data === null) {
            return redirect()->route('connection.consumer.create', $connectionId);
        }


        return Inertia::render('Consumer/ConsumerShow', [
            'consumer' => $response->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
