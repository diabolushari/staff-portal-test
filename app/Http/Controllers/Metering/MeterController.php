<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterFormRequest;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTimezoneTypeRelService;
use App\Services\Metering\MeterTransformerRelService;
use App\Services\Metering\MeterTransformerService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class MeterController extends Controller
{
    public function __construct(
        private readonly MeterService $meterService,
        private readonly MeterTimezoneTypeRelService $meterTimezoneTypeRelService,
        private readonly MeterTransformerRelService $meterTransformerRelService,
        private readonly MeterTransformerService $meterTransformerService,
        private readonly ParameterValueService $parameterValueService
    ) {}

    public function index(): Response
    {
        $pageNumber = request()->input('page') ?? 1;
        $pageSize = request()->input('page_size') ?? 10;
        $search = request()->input('search') ?? null;
        $sortBy = request()->input('sort_by') ?? null;
        $sortDirection = request()->input('sort_direction') ?? null;
        $response = $this->meterService->listMetersPaginated(
            pageNumber: $pageNumber,
            pageSize: $pageSize,
            meterSerial: $search,
            sortBy: $sortBy,
            sortDirection: $sortDirection,

        );
        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['meters'],                // items for this page
                $response->data['total_count'],            // total items count
                $response->data['page_size'],              // items per page
                $response->data['page_number'],            // current page
                ['path' => request()->url()]              // so pagination links work properly
            );
        }

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return Inertia::render('Meters/MeterIndex', [
            'meters' => $paginated ?? [],
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        $viewData = [
            'ownershipTypes' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Ownership Type'
            )->data,
            'meterProfiles' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Meter Profile'
            )->data,
            'makes' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Make'
            )->data,
            'types' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Type'
            )->data,
            'categories' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Category'
            )->data,
            'accuracyClasses' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Accuracy Class'
            )->data,
            'phases' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Phase'
            )->data,
            'dialingFactors' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Dialing Factor'
            )->data,
            'units' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Unit'
            )->data,
            'resetTypes' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Reset Type'
            )->data,
            'internalPtRatios' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Internal PT Ratio'
            )->data,
            'internalCtRatios' => $this->parameterValueService->getParameterValues(
                null, null, null, 'Meter', 'Internal CT Ratio'
            )->data,
        ];

        return Inertia::render('Meters/MeterForm', $viewData);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MeterFormRequest $request): RedirectResponse
    {

        $meterDataArray = $request->toArray();
        $meterDataArray['created_by'] = auth()->id();

        $response = $this->meterService->createMeter($meterDataArray);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->route('meters.index')
            ->with(['message' => 'Meter created successful']);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): Response|RedirectResponse
    {
        $response = $this->meterService->getMeter($id);
        $relResponse = $this->meterTransformerRelService->getRelByMeterId($id);
        if ($relResponse->hasError() == false) {
            $ctptId = $relResponse->data['ctpt_id'] ?? null;
            if ($ctptId) {
                $ctptResponse = $this->meterTransformerService->getTransformer($ctptId);
            }
        }
        
        $currentTimezone = $this->meterTimezoneTypeRelService->getActiveMeterTimezoneTypeRelByMeterId($id);

        $timezoneTypesResponse = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Timezone Type');

        return Inertia::render('Meters/MeterShow', [
            'meter' => $response->data,
            'ctpt' => $ctptResponse->data ?? null,
            'currentTimezone' => $currentTimezone->data,
            'timezoneTypes' => $timezoneTypesResponse->data,
            'relation' => $relResponse->data ?? null,
        ]);

    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->meterService->deleteMeter($id);

        if ($response->hasError()) {
            return $response->error;
        }

        return redirect()->route('meters.index')->with('success', 'Meter deleted successfully.');
    }
}
