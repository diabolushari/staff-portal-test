<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\ConnectionGreenEnergyFormRequest;
use App\Services\Connection\ConnectionGreenEnergyService;

class ConnectionGreenEnergyController extends Controller
{
    public function __construct(
        private readonly ConnectionGreenEnergyService $connectionGreenEnergyService,
    ) {}

    public function __invoke(ConnectionGreenEnergyFormRequest $request)
    {

        $response = $this->connectionGreenEnergyService->create($request);

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return back()->with('message', 'Green energy created successfully');
    }
}
