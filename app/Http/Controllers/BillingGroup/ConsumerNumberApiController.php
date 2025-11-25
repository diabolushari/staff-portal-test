<?php
namespace App\Http\Controllers\BillingGroup;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\Connection\ConnectionService;
class ConsumerNumberApiController extends Controller
{
    public function __construct(private ConnectionService $connectionService) {}
    public function __invoke(Request $request): JsonResponse
    {
        $query = $request->query('q');

        if (!$query) {
            return response()->json([]);
        }

        $connections = $this->connectionService
            ->listConnections($query)
            ->data;

        $consumerArray = [];

        if ($connections !== null) {
            foreach ($connections as $conn) {
                $consumerArray[] = [
                    'connection_id'   => $conn['connection_id'],
                    'consumer_number' => $conn['consumer_number'],
                    'connection_type_id'     => $conn['connection_type_id'],
                ];
            }
        }

        return response()->json($consumerArray);
    }
}
