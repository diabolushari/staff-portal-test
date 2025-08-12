<?php

namespace App\Http\Controllers\SystemModule;

use App\Http\Controllers\Controller;
use App\Http\Requests\SystemModule\SystemModuleFormRequest;
use App\Services\SystemModule\SystemModuleService;
use Inertia\Inertia;

class SystemModuleController extends Controller
{


    public function __construct(private SystemModuleService $systemModuleService){

    }

    public function index()
    {
        $response = $this->systemModuleService->getSystemModules(page: 1, pageSize: 5);

        if ($response->hasError()) {
            return $response->error;
        }

        return Inertia::render('SystemModules/SystemModuleIndex', [
            'systemModules' => $response->data,
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function store(SystemModuleFormRequest $request)
    {
        $response = $this->systemModuleService->createSystemModule($request);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'System Module created successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function update(SystemModuleFormRequest $request, $id)
    {
        $response = $this->systemModuleService->updateSystemModule($request, $id);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'System Module updated successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }

    public function destroy($id)
    {
        $response = $this->systemModuleService->deleteSystemModule($id);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'System Module deleted successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
