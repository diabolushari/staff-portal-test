<?php

namespace App\Http\Controllers\Consumers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Consumers\OfficeFormRequest;
use App\Services\Consumers\OfficeService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class OfficeController extends Controller
{
    public function __construct(
        private OfficeService $officeService,
        private ParameterValueService $parameterValueService,
    ) {}

    public function index(Request $request): Response|RedirectResponse
    {
        $officeType = $request->input('office_type') ?? null;
        $officeName = $request->input('search') ?? null;
        $search = $request->input('search') ?? null;


        $offices = $this->officeService->getOffices(
            page: 1,
            pageSize: 10,
            search: null,
            officeType: $officeType,
            officeName: $search
        );
        if ($offices->hasError()) {
            return $offices->error;
        }

        $parameterValueService = new ParameterValueService;
        $officeTypes = $parameterValueService->getParameterValues(1, 100, null, null, 'Distribution Office Type');

        return Inertia::render('Offices/OfficeIndex', [
            'offices' => $offices->data,
            'office_types' => $officeTypes->data,
            'filters' => [
                'office_type' => $officeType,
                'office_name' => $officeName,
            ],
        ]);
    }

    public function create()
    {
        $parameterValues = $this->parameterValueService->getParameterValues(
            1,
            100,
            null,
            'Organization-Distribution',
            'Office Type'
        );

        if ($parameterValues->hasError()) {
            return $parameterValues->error;
        }

        return Inertia::render('Offices/OfficeCreate', [
            'parameterValues' => $parameterValues->data,
        ]);
    }

    public function store(OfficeFormRequest $request)
    {

        $office = $this->officeService->createOffice($request);
        if ($office->hasError()) {
            return $office->error;
        }

        return redirect()->route('offices.index');
    }

    public function show(int $id)
    {
        $office = $this->officeService->getOffice($id);
        if ($office->hasError()) {
            return $office->error;
        }

        return Inertia::render('Offices/OfficeShow', [
            'office' => $office->data,
        ]);
    }

    public function edit(int $id)
    {
        $office = $this->officeService->getOffice($id);
        if ($office->hasError()) {
            return $office->error;
        }
        $parameterValues = $this->parameterValueService->getParameterValues(
            1,
            100,
            null,
            'Organization-Distribution',
            'Office Type'
        );

        return Inertia::render('Offices/OfficeCreate', [
            'office' => $office->data,
            'parameterValues' => $parameterValues->data,
        ]);
    }

    public function update(OfficeFormRequest $request, $id)
    {
        $office = $this->officeService->updateOffice($request, $id);
        if ($office->hasError()) {
            return $office->error;
        }

        return redirect()->route('offices.index');
    }

    public function destroy($id)
    {
        $response = $this->officeService->deleteOffice($id);
        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->back()->with([
            'message' => 'Office deleted successfully.',
            'grpcStatus' => [
                'code' => $response->statusCode,
                'details' => $response->statusDetails,
            ],
        ]);
    }
}
