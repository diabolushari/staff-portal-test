<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Google\Protobuf\GPBEmpty;
use Proto\consumers\OfficeServiceClient;
use Grpc\ChannelCredentials;


class OfficeListApiController extends Controller
{
    private $client;
    public function __construct()
    {
        $this->client = new OfficeServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }
    public function __invoke()
    {
        $req = new GPBEmpty();
        [$response, $status] = $this->client->ListOffices($req)->wait();

        if ($status->code !== 0) {
            return redirect()->back()->withErrors([
                'grpc_error' => $status->details,
            ]);
        }
        $offices = $response->getOffices();
        $officeArray = [];
        foreach ($offices as $office) {
            $officeArray[] = json_decode($office->serializeToJsonString(), true);
        }

        return response()->json($officeArray);
    }
}
