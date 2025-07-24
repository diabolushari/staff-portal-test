<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Proto\Modules\SystemModuleServiceClient;
use Grpc\ChannelCredentials;
use Proto\Modules\ListSystemModulesRequest;

class SystemModuleApiController extends Controller
{
    private $client;
    public function __construct()
    {
        $this->client = new SystemModuleServiceClient(env('SERVER_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }

    public function __invoke()
    {
        $req = new ListSystemModulesRequest();


        list($res, $status) = $this->client->ListSystemModules($req)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return response()->json(['error' => $status->details], 500);
        }

        $systemModules = $res->getModules();

        $systemModulesArray = [];
        foreach ($systemModules as $systemModule) {
            $systemModulesArray[] = [
                'id' => $systemModule->getId(),
                'name' => $systemModule->getName(),
            ];
        }

        return response()->json($systemModulesArray);
    }
}
