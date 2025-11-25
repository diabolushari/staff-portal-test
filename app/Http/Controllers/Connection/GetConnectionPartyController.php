<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Parties\PartyService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GetConnectionPartyController extends Controller
{
    public function __construct(private readonly ConnectionService $connectionService,
        private readonly PartyService $partyService) {}

    public function __invoke(int $connectionId, Request $request): Response
    {
        $connection = $this->connectionService->getConnection($connectionId);
        $parties = $this->partyService->getParties(null);

        return Inertia::render('Connections/ConnectionParties', [
            'connection' => $connection->data,
            'parties' => $parties->data,
        ]);
    }
}
