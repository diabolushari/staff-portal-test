<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
    public function index()
    {

        return response()->json([]);
    }
}
