<?php

namespace App\Http\Controllers\SystemModule;

use App\Http\Controllers\Controller;
use App\Http\Requests\SystemModule\SystemModuleFormRequest;
use App\Services\Grpc\GrpcErrorService;
use Inertia\Inertia;
use Proto\Modules\CreateSystemModuleRequest;
use Proto\Modules\DeleteSystemModuleRequest;
use Proto\Modules\ListSystemModulesRequest;
use Proto\Modules\SystemModule;
use Proto\Modules\SystemModuleServiceClient;
use Proto\Modules\UpdateSystemModuleRequest;

class SystemModuleController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new SystemModuleServiceClient(env('GRPC_HOST'), [
            'credentials' => \Grpc\ChannelCredentials::createInsecure(),
        ]);
    }

    public function index()
    {
        $req = new ListSystemModulesRequest;
        $req->setPage(1);
        $req->setPageSize(5);

        [$res, $status] = $this->client->ListSystemModules($req)->wait();

        if ($status->code !== 0) {
            $errorResponse = GrpcErrorService::handleErrorResponse($status);
            if ($errorResponse != null) {
                return $errorResponse;
            }
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
            'systemModules' => $systemModulesArray,
        ]);
    }

    public function store(SystemModuleFormRequest $request)
    {
        $systemModule = new SystemModule;
        $systemModule->setName($request->systemModuleName);

        $grpcRequest = new CreateSystemModuleRequest;
        $grpcRequest->setModule($systemModule);

        [, $status] = $this->client->CreateSystemModule($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse != null) {
            return $errorResponse;
        }

        return redirect()->back()->with('message', 'System Module created successfully.');
    }

    public function update(SystemModuleFormRequest $request, $id)
    {
        $systemModule = new SystemModule;
        $systemModule->setName($request->systemModuleName);
        $systemModule->setId($id);

        $grpcRequest = new UpdateSystemModuleRequest;
        $grpcRequest->setModule($systemModule);

        [, $status] = $this->client->UpdateSystemModule($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse != null) {
            return $errorResponse;
        }

        return redirect()->back()->with('message', 'System Module updated successfully.');
    }

    public function destroy($id)
    {
        $grpcRequest = new DeleteSystemModuleRequest;
        $grpcRequest->setId($id);

        [, $status] = $this->client->DeleteSystemModule($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse != null) {
            return $errorResponse;
        }

        return redirect()->back()->with('message', 'System Module deleted successfully.');
    }
}
