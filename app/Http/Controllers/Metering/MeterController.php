<?php

namespace App\Http\Controllers\Metering;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metering\MeterFormRequest;
use App\Services\Metering\GetMeterFormParameterService;
use App\Services\Metering\MeterService;
use App\Services\Metering\MeterTimezoneTypeRelService;
use App\Services\Metering\MeterTransformerRelService;
use App\Services\Metering\MeterTransformerService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MeterController extends Controller
{
    public function __construct(
        private readonly MeterService $meterService,
        private readonly MeterTimezoneTypeRelService $meterTimezoneTypeRelService,
        private readonly MeterTransformerRelService $meterTransformerRelService,
        private readonly MeterTransformerService $meterTransformerService,
        private readonly ParameterValueService $parameterValueService,
        private readonly GetMeterFormParameterService $getMeterFormParameterService
    ) {}

    public function index(): Response|RedirectResponse
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
        $viewData = $this->getMeterFormParameterService->getMeterFormParameters();

        return Inertia::render('Meters/MeterCreatePage', $viewData);
    }


    public function store(MeterFormRequest $request): RedirectResponse
    {
        $user = Auth::user();
        if ($user) {
            $request->createdBy = $user->id;
        }

        $response = $this->meterService->createMeter($request);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
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

    public function edit(int $id): Response|RedirectResponse
    {
        $response = $this->meterService->getMeter($id);

        $viewData = $this->getMeterFormParameterService->getMeterFormParameters();
        $currentTimezone = $this->meterTimezoneTypeRelService->getActiveMeterTimezoneTypeRelByMeterId($id);

        $timezoneTypesResponse = $this->parameterValueService->getParameterValues(null, null, null, 'Meter', 'Timezone Type');

        return Inertia::render('Meters/MeterCreatePage', [
            'meter' => $response->data,
            'currentTimezone' => $currentTimezone->data,
            'timezoneTypes' => $timezoneTypesResponse->data,
            ...$viewData,

        ]);
    }

    public function update(MeterFormRequest $request, int $id): RedirectResponse
    {
        $user = Auth::user();
        if ($user) {
            $request->updatedBy = $user->id;
        }

        $response = $this->meterService->updateMeter($request);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('meters.index')->with(['message' => 'Meter updated successfully.']);
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->meterService->deleteMeter($id);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return redirect()->route('meters.index')->with(['message' => 'Meter deleted successfully.']);
    }
}
