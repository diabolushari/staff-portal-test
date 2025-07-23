<?php

namespace App\Http\Controllers\SystemModule;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Proto\Modules\SystemModuleServiceClient;
use Grpc\ChannelCredentials;
use Illuminate\Http\Request;
use Proto\Modules\CreateSystemModuleRequest;
use Proto\Modules\ListSystemModulesRequest;
use Proto\Modules\SystemModule;

class SystemModuleController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new SystemModuleServiceClient('localhost:9090', [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }
    public function index()
    {
        $req = new ListSystemModulesRequest();
        $req->setPage(1);
        $req->setPageSize(10);


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

        return Inertia::render('SystemModules/SystemModuleIndex', [
            'systemModules' => $systemModulesArray
        ]);
    }
    public function store(Request $request)
    {
        // 1. Validate input from frontend
        $validated = $request->validate([
            'system_module_name' => 'required|string',
        ]);

        // 2. Create SystemModule message
        $systemModule = new SystemModule();
        $systemModule->setName($validated['system_module_name']);


        // 3. Create CreateSystemModuleRequest message
        $grpcRequest = new CreateSystemModuleRequest();
        $grpcRequest->setModule($systemModule);


        list($response, $status) = $this->client->CreateSystemModule($grpcRequest)->wait();

        // 5. Check response status
        if ($status->code !== \Grpc\STATUS_OK) {
            return redirect()->back()->withErrors(['grpc' => 'Failed to create module']);
        }

        // 6. Redirect or return response
        return redirect()->route('system-module.index')->with('success', 'System Module created successfully.');
    }
}
