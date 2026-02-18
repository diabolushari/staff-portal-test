<?php

namespace App\Http\Controllers\SecurityDeposit;

use App\Http\Controllers\Controller;
use App\Http\Requests\SecurityDeposit\SdCollectionFormRequest;
use App\Services\Parameters\ParameterValueService;
use App\Services\SecurityDeposit\SdCollectionService;
use App\Services\SecurityDeposit\SdDemandsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SdCollectionController extends Controller
{
    public function __construct(
        private readonly SdCollectionService $sdCollectionService,
        private readonly SdDemandsService $sdDemandsService,
        private readonly ParameterValueService $parameterValueService,
    ) {}

    /**
     * List collections for a SD Demand
     */
    public function index(int $sdDemandId): Response
    {
        $sdDemand = $this->sdDemandsService->getSdDemand($sdDemandId)->data;
        $collections = $this->sdCollectionService
            ->listBySdDemand($sdDemandId)
            ->data;

        return Inertia::render('SecurityDeposit/SdCollections/SdCollectionIndex', [
            'sdDemand' => $sdDemand,
            'collections' => $collections,
        ]);
    }

    /**
     * Show create form
     */
    public function create(Request $request): Response
    {
        $sdDemandId = $request->input('sdDemandId');

        $sdDemand = $this->sdDemandsService->getSdDemand($sdDemandId)->data;

        $collectionModes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Connection', 'Collection Mode')
            ->data;

        $attributeDefinitions = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Connection', 'Collection Attribute')
            ->data;

        return Inertia::render('SecurityDeposit/SdDemands/SdCollectionCreate', [
            'sdDemand' => $sdDemand,
            'collectionModes' => $collectionModes,
            'attributeDefinitions' => $attributeDefinitions,
        ]);
    }


    /**
     * Store new collection
     */
   public function store(SdCollectionFormRequest $request): RedirectResponse
{
    $response = $this->sdCollectionService->create($request);

    if ($response->hasValidationError() || $response->statusCode !== 0) {
        return redirect()->back()->withErrors([
            'message' => $response->statusDetails ?? 'Unknown error',
        ]);
    }

    return redirect()
        ->route('sd-demand.sd-collections', $request->sdDemandId)
        ->with('message', 'SD Collection added successfully');
}

    /**
     * Edit collection
     */
    public function edit(int $id): Response
    {
        $collection = $this->sdCollectionService->get($id)->data;

        $collectionModes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Connection', 'Collection Mode')
            ->data;

        return Inertia::render('SecurityDeposit/SdCollections/SdCollectionCreate', [
            'sdCollection' => $collection,
            'collectionModes' => $collectionModes,
            'sdDemand' => $collection->sd_demand,
        ]);
    }

    /**
     * Update collection
     */
    public function update(SdCollectionFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->sdCollectionService->update($request, $id);

        if ($response->hasValidationError() || $response->statusCode !== 0) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        $sdDemandId = $request->sd_demand_id;

        return redirect()
            ->route('sd-demand.sd-collections', $sdDemandId)
            ->with('message', 'SD Collection updated successfully');
    }

    /**
     * Delete collection
     */
    public function destroy(int $id): RedirectResponse
    {
        $collection = $this->sdCollectionService->get($id)->data;
        $sdDemandId = $collection->sd_demand_id;

        $response = $this->sdCollectionService->delete($id);

        if (!$response->success) {
            return redirect()->back()->with(
                'error',
                $response->error ?? 'Failed to delete SD collection.'
            );
        }

        return redirect()
            ->route('sd-demand.sd-collections', $sdDemandId)
            ->with('message', 'SD Collection deleted successfully.');
    }
}
