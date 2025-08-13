<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Google\Protobuf\GPBEmpty;
use Proto\consumers\OfficeServiceClient;
use Grpc\ChannelCredentials;
use Illuminate\Http\Request;

class OfficeListApiController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new OfficeServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }

    public function __invoke(Request $request)
    {
        $req = new GPBEmpty();

        [$response, $status] = $this->client->ListOffices($req)->wait();

        if ($status->code !== 0) {
            return response()->json([
                'error' => $status->details,
            ], 500);
        }

        $offices = $response->getOffices();
        $officeArray = [];

        foreach ($offices as $office) {
            $data = json_decode($office->serializeToJsonString(), true);
            $officeArray[] = $data;
        }

        // Filtering logic
        $officeTypeId = $request->query('officeTypeId') - 1;
        $query = $request->query('q');

        $filtered = collect($officeArray)
            ->when($officeTypeId, function ($collection) use ($officeTypeId) {
                return $collection->where('officeTypeId', (int) $officeTypeId);
            })
            ->when($query, function ($collection) use ($query) {
                return $collection->filter(function ($item) use ($query) {
                    $name = $item['officeCode'] ?? '';
                    return stripos($name, $query) === 0; // name starts with query
                });
            })
            ->values(); // Reindex array

        return response()->json($filtered);
    }
}
