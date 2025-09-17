<?php

namespace App\Http\Controllers\Consumers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Consumers\OfficeFormRequest;
use App\Services\Consumers\OfficeService;
use App\Services\Offices\OfficeHierarchyService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfficeController extends Controller
{
    public function __construct(
        private readonly OfficeService $officeService,
        private readonly ParameterValueService $parameterValueService,
        private readonly OfficeHierarchyService $officeHierarchyService,
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
            return $offices->error ?? redirect()->back()->withErrors([
                'message' => $offices->statusDetails ?? 'Unknown error',
            ]);
        }
        $officeTypes = $this->parameterValueService->getParameterValues(1, 100, null, null, 'Distribution Office Type');

        return Inertia::render('Offices/OfficeIndex', [
            'offices' => $offices->data,
            'office_types' => $officeTypes->data,
            'filters' => [
                'office_type' => $officeType,
                'office_name' => $officeName,
            ],
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        $parameterValues = $this->parameterValueService->getParameterValues(
            1,
            100,
            null,
            'Organization-Distribution',
            'Office Type'
        );
        $officeHierarchies = $this->officeHierarchyService->getOfficeHierarchies();

        if ($parameterValues->hasError()) {
            return $parameterValues->error ?? redirect()->back()->withErrors([
                'message' => $parameterValues->statusDetails ?? 'Unknown error',
            ]);
        }

        return Inertia::render('Offices/OfficeCreate', [
            'parameterValues' => $parameterValues->data,
            'officeHierarchies' => $officeHierarchies->data,
        ]);
    }

    public function store(OfficeFormRequest $request): Response|RedirectResponse
    {
        $grpcResponse = $this->officeService->createOffice($request);
        if ($grpcResponse->hasError()) {
            return $grpcResponse->error ?? redirect()->back()->withErrors([
                'message' => $grpcResponse->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('offices.index');
    }

    public function show(int $id): Response|RedirectResponse
    {
        $officeHierarchies = $this->officeHierarchyService->getOfficeHierarchies();

        $response = $this->officeService->getOffice($id);
        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }
        if ($response->data == null) {
            return redirect()->back()->withErrors([
                'message' => 'Office not found',
            ]);
        }
        /** @var array<int, array{hierarchy_code?: string}> $parentOffices */
        $parentOffices = $response->data['parent_offices'] ?? [];
        $parentHierarchyIds = collect($parentOffices)
            ->map(fn (array $parent): ?string => $parent['hierarchy_code'] ?? null)
            ->filter(fn (?string $id) => $id !== null)
            ->toArray();
        $officeHierarchiesWithoutSelected = collect($officeHierarchies->data ?? [])
            ->filter(fn ($hierarchy) => ! in_array($hierarchy['hierarchy_code'], $parentHierarchyIds))
            ->values();

        return Inertia::render('Offices/OfficeShow', [
            'office' => $response->data['office'],
            'parentOffices' => $response->data['parent_offices'],
            'officeHierarchiesWithoutSelected' => $officeHierarchiesWithoutSelected,
        ]);
    }

    public function edit(int $id): Response|RedirectResponse
    {
        $office = $this->officeService->getOffice($id);
        if ($office->hasError()) {
            return $office->error ?? redirect()->back()->withErrors([
                'message' => $office->statusDetails ?? 'Unknown error',
            ]);
        }
        $parameterValues = $this->parameterValueService->getParameterValues(
            1,
            100,
            null,
            'Organization-Distribution',
            'Office Type'
        );

        $office = $office->data['office'];

        return Inertia::render('Offices/OfficeCreate', [
            'office' => $office,
            'parameterValues' => $parameterValues->data,
        ]);
    }

    public function update(OfficeFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->officeService->updateOffice($request, $id);
        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('offices.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->officeService->deleteOffice($id);
        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
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
