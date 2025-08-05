<?php

namespace App\Http\Controllers\SystemModule;

use App\Http\Controllers\Controller;
use App\Http\Requests\SystemModule\SystemModuleFormRequest;
use Inertia\Inertia;
use Proto\Modules\SystemModuleServiceClient;
use Grpc\ChannelCredentials;
use Illuminate\Http\Request;
use Proto\Modules\CreateSystemModuleRequest;
use Proto\Modules\DeleteSystemModuleRequest;
use Proto\Modules\ListSystemModulesRequest;
use Proto\Modules\SystemModule;
use Proto\Modules\UpdateSystemModuleRequest;

class SystemModuleController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new SystemModuleServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }
    public function index()
    {
        $req = new ListSystemModulesRequest();
        $req->setPage(1);
        $req->setPageSize(5);


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
    public function store(SystemModuleFormRequest $request)
    {

        $systemModule = new SystemModule();
        $systemModule->setName($request->systemModuleName);

        $grpcRequest = new CreateSystemModuleRequest();
        $grpcRequest->setModule($systemModule);


        list($response, $status) = $this->client->CreateSystemModule($grpcRequest)->wait();


        if ($status->code !== \Grpc\STATUS_OK) {
            dd($status);
            return redirect()->back()->withErrors(['grpc' => 'Failed to create module']);
        }

        return redirect()->back()->with(['message', 'System Module created successfully.']);
    }

    public function update(SystemModuleFormRequest $request, $id)
    {
        $systemModule = new SystemModule();
        $systemModule->setName($request->systemModuleName);
        $systemModule->setId($id);


        $grpcRequest = new UpdateSystemModuleRequest();
        $grpcRequest->setModule($systemModule);


        list($response, $status) = $this->client->UpdateSystemModule($grpcRequest)->wait();

        if ($status->code !== \Grpc\STATUS_OK) {
            return redirect()->back()->with(['error' => 'Failed to update module']);
        }
        return redirect()->back()->with(['message', 'System Module updated successfully.']);
    }

    public function destroy($id)
    {
        $grpcRequest = new DeleteSystemModuleRequest();
        $grpcRequest->setId($id);

        list($response, $status) = $this->client->DeleteSystemModule($grpcRequest)->wait();
        if ($status->code !== \Grpc\STATUS_OK) {

            if ($status->code !== \Grpc\STATUS_OK) {
                return redirect()->back()->with(['error' => 'Failed to delete module']);
            }
        }

        return redirect()->back()->with(['message', 'System Module deleted successfully.']);
    }
}
