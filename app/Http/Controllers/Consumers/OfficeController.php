<?php

namespace App\Http\Controllers\Consumers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Consumers\OfficeFormRequest;
use App\Services\Consumers\OfficeService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\Parameters\ParameterValueService;


class OfficeController extends Controller
{

    public function __construct(
        private OfficeService $officeService,
        private ParameterValueService $parameterValueService,
    ) {}


    public function index(Request $request)
    {
        $search = $request->input('search') ?? null;
        $officeType = $request->input('office_type') ?? null;
        $officeName = $request->input('office_name') ?? null;

        $offices = $this->officeService->getOffices(
            page: 1,
            pageSize: 10,
            search: $search,
            officeType: $officeType,
            officeName: $officeName
        );
        if ($offices->hasError()) {
            return $offices->error;
        }

        $parameterValueService = new ParameterValueService();
        $officeTypes = $parameterValueService->getParameterValues(1, 100, null, null, 'Distribution Office Type');

        return Inertia::render('Offices/OfficeIndex', [
            'offices' => $offices->data,
            'office_types' => $officeTypes->data,
            'filters' => [
                'search' => $search,
                'office_type' => $officeType,
                'office_name' => $officeName,
            ],
        ]);
    }
    public function create()
    {
        $parameterValues = $this->parameterValueService->getParameterValues(1, 100, null, null, null);
        if ($parameterValues->hasError()) {
            return $parameterValues->error;
        }

        return Inertia::render('Offices/OfficeForm', [
            'parameterValues' => $parameterValues->data,
        ]);
    }
    public function edit($id) {}
    public function update(Request $request, $id) {}
    public function destroy($id) {}

    public function show($id)
    {
        $office = $this->officeService->getOffice($id);
        if ($office->hasError()) {
            return $office->error;
        }


        return Inertia::render('Offices/OfficeShow', [
            'office' => $office->data,
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
}
