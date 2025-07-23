<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Proto\Parameters\ParameterDomainServiceClient;
use Grpc\ChannelCredentials;
use Proto\Parameters\ListParameterDomainsRequest;

class ParameterDomainController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new ParameterDomainServiceClient('localhost:9090', [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);

        $req = new ListParameterDomainsRequest();
        $req->setPage($page);
        $req->setPageSize($pageSize);

        // Call the ListSystemModules RPC
        list($res, $status) = $this->client->ListParameterDomains($req)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        $domainsArray = [];
        foreach ($res->getDomains() as $domain) {
            $domainsArray[] = [
                'id' => $domain->getId(),
                'domain_name' => $domain->getDomainName(),
                'description' => $domain->getDescription(),
                'domain_code' => $domain->getDomainCode(),
                'managed_by_module' => $domain->getManagedByModule(),

            ];
        }

        return response()->json([
            'domains' => $domainsArray,
        ]);
    }
}
