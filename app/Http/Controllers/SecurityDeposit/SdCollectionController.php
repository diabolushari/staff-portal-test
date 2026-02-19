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


    /**
     * Show create form
     */
    public function create(Request $request): Response
    {
        $sdDemandId = $request->input('sdDemandId');

        $sdDemand = $this->sdDemandsService->getSdDemand($sdDemandId)->data;

        $collectionModes = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Connection', 'SD Collection Mode')
            ->data;

        $attributeDefinitions = $this->parameterValueService
            ->getParameterValues(null, null, null, 'Connection', 'SD Collection Attribute')
            ->data;

        return Inertia::render('SecurityDeposit/SdCollections/SdCollectionCreate', [
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

        $sdDemand = $this->sdDemandsService->getSdDemand($request->sdDemandId)->data;

        $connectionId = $sdDemand['connection_id'];

        return redirect()
            ->route('connection.sd-demands', $connectionId)
            ->with('message', 'SD Collection added successfully');
    }
}
