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
use Illuminate\Http\Request;
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

    public function index(Request $request): Response|RedirectResponse
    {
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $meter_serial = $request->input('meter_serial') ?? null;
        $smart_meter_ind = $request->boolean('smart_meter_ind');
        $bidirectional_ind = $request->boolean('bidirectional_ind');
        $meter_type_id = $request->input('meter_type_id') ?? null;
        $meter_profile_id = $request->input('meter_profile_id') ?? null;
        $meter_make_id = $request->input('meter_make_id') ?? null;
        $ownership_type_id = $request->input('ownership_type_id') ?? null;
        $programmable_ct_ratio = $request->input('programmable_ct_ratio') ?? null;
        $programmable_pt_ratio = $request->input('programmable_pt_ratio') ?? null;
        $sortBy = $request->input('sort_by') ?? null;
        $sortDirection = request()->input('sort_direction') ?? null;
        $response = $this->meterService->listMetersPaginated(
            pageNumber: $pageNumber,
            pageSize: $pageSize,
            meterSerial: $meter_serial,
            smartMeterInd: $smart_meter_ind,
            bidirectionalInd: $bidirectional_ind,
            meterTypeId: $meter_type_id,
            meterProfileId: $meter_profile_id,
            meterMakeId: $meter_make_id,
            ownershipTypeId: $ownership_type_id,
            programmablePtRatio: $programmable_pt_ratio,
            programmableCtRatio: $programmable_ct_ratio,
            sortBy: $sortBy,
            sortDirection: $sortDirection,
        );
        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }
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

        $types = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Meter',
            'Type'
        )->data;
        $meterProfiles = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Meter',
            'Meter Profile'
        )->data;
        $ownershipTypes = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Meter',
            'Ownership Type'
        )->data;

        return Inertia::render('Meters/MeterIndex', [
            'meters' => $paginated ?? [],
            'oldMeterSerial' => $meter_serial,
            'oldSmartMeterInd' => $smart_meter_ind,
            'oldBidirectionalInd' => $bidirectional_ind,
            'oldMeterTypeId' => $meter_type_id,
            'oldMeterProfileId' => $meter_profile_id,
            'oldMeterMakeId' => $meter_make_id,
            'oldOwnershipTypeId' => $ownership_type_id,
            'oldProgrammableCtRatio' => $programmable_ct_ratio,
            'oldProgrammablePtRatio' => $programmable_pt_ratio,
            'oldSortBy' => $sortBy,
            'oldSortDirection' => $sortDirection,
            'types' => $types,
            'meterProfiles' => $meterProfiles,
            'ownershipTypes' => $ownershipTypes,
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        $viewData = [
            'ownershipTypes' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Ownership Type'
            )->data,
            'meterProfiles' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Meter Profile'
            )->data,
            'makes' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Make'
            )->data,
            'types' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Type'
            )->data,
            'categories' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Category'
            )->data,
            'accuracyClasses' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Accuracy Class'
            )->data,
            'phases' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Phase'
            )->data,
            'dialingFactors' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Dialing Factor'
            )->data,
            'units' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Unit'
            )->data,
            'resetTypes' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Reset Type'
            )->data,
            'internalPtRatios' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Internal PT Ratio'
            )->data,
            'internalCtRatios' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Internal CT Ratio'
            )->data,
            'timezoneTypes' => $this->parameterValueService->getParameterValues(
                null,
                null,
                null,
                'Meter',
                'Timezone Type'
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
            return redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
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
        $transformers = [];
        if ($relResponse->hasError() == false) {
            $ctpts = $relResponse->data ?? [];
            foreach ($ctpts as $ctpt) {
                $transformers[] = $this->meterTransformerService->getTransformer($ctpt['ctpt_id'])->data;
            }
        }

        $currentTimezone = $this->meterTimezoneTypeRelService->getActiveMeterTimezoneTypeRelByMeterId($id);

        $timezoneTypesResponse = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Timezone Type');

        return Inertia::render('Meters/MeterShow', [
            'meter' => $response->data,
            'transformers' => $transformers,
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

        return redirect()->route('meters.index')->with(['message' => 'Meter deleted successfully.']);
    }
}
