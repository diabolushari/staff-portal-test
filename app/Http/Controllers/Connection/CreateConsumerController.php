<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConsumerService;
use App\Services\Consumers\GeoRegionsService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CreateConsumerController extends Controller
{
    public function __construct(
        private readonly ParameterValueService $parameterValueService,
        private readonly GeoRegionsService $geoRegionsService,
        private readonly ConsumerService $consumerService
    ) {}

    public function __invoke(Request $request, int $connectionId): InertiaResponse|RedirectResponse
    {
        $consumerTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Consumer Type'
        );
        $districts = $this->geoRegionsService->getGeoRegions(
            'Administrative',
            'District'
        );
        $states = $this->geoRegionsService->getGeoRegions(
            'Administrative',
            'State'
        );
        $connection = $this->consumerService->getConsumer($connectionId);
        if ($connection->data != null) {
            return redirect()->route('connection.consumer', $connectionId);
        }

        return Inertia::render('Consumer/ConsumerForm', [
            'consumer_types' => $consumerTypes->data,
            'districts' => $districts->data,
            'states' => $states->data,
            'connection_id' => $connectionId,
        ]);
    }
}
