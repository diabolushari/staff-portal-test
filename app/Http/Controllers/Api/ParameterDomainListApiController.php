<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Grpc\ChannelCredentials;
use Proto\Parameters\ListParameterDomainsRequest;
use Proto\Parameters\ParameterDomainServiceClient;

class ParameterDomainListApiController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new ParameterDomainServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }

    public function __invoke()
    {
        $request = new ListParameterDomainsRequest();

        list($response, $status) = $this->client->ListParameterDomains($request)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        $domains = $response->getDomains(); // make sure this method exists in your generated proto
        $domainArray = [];

        foreach ($domains as $domain) {
            $domainArray[] = [
                'id' => $domain->getId(),
                'name' => $domain->getDomainName(),
                'description' => $domain->getDescription(),
                'code' => $domain->getDomainCode()
            ];
        }

        return response()->json($domainArray);
    }
}
