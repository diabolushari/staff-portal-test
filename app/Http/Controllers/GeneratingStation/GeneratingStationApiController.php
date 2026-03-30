<?php

namespace App\Http\Controllers\GeneratingStation;

use App\GrpcConverters\GeneratingStation\GeneratingStationConverter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\GeneratingStation\GeneratingStationService;

class GeneratingStationApiController extends Controller
{
    public function __construct(
        private GeneratingStationService $generatingStationService
    ) {}

   public function __invoke(Request $request): JsonResponse
{
    $query = $request->query('q');
    $consumerConnectionId = $request->query('consumer_connection_id');

    if (!$query) {
        return response()->json([]);
    }

    $stations = $this->generatingStationService
        ->listGeneratingStations($query, $consumerConnectionId)
        ->data ?? [];

    return response()->json($stations);
}
}