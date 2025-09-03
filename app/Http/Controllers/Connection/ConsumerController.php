<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Connections\ConsumerFormRequest;
use App\Services\Connection\ConnectionService;
use App\Services\Connection\ConsumerService;
use App\Services\Consumers\GeoRegionsService;
use App\Services\Parameters\ParameterValueService;
use Inertia\Inertia;

class ConsumerController extends Controller
{
    public function __construct(
        private readonly ConsumerService $consumerService,
        private readonly ParameterValueService $parameterValueService,
        private readonly GeoRegionsService $geoRegionsService,
    ) {}

    public function index()
    {

        return Inertia::render('Consumer/ConsumerIndex');
    }
    public function create()
    {
        $consumerTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Consumer Type'
        );
        $geoRegions = $this->geoRegionsService->getGeoRegions();


        return Inertia::render('Consumer/ConsumerForm', [
            'consumer_types' => $consumerTypes->data,
            'geo_regions' => $geoRegions->data,
        ]);
    }

    public function store(ConsumerFormRequest $request)
    {

        $this->consumerService->createConsumer($request);
    }

    public function edit(int $connectionId)
    {
        $consumer = $this->consumerService->getConsumer($connectionId);
        $consumerTypes = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Consumer Type'
        );
        $geoRegions = $this->geoRegionsService->getGeoRegions();


        return Inertia::render('Consumer/ConsumerForm', [
            'consumer_types' => $consumerTypes->data,
            'geo_regions' => $geoRegions->data,
            'consumer' => $consumer->data,
        ]);
    }

    public function update(ConsumerFormRequest $request, int $connectionId)
    {
        $this->consumerService->updateConsumer($request);
        return json([
            'status' => 'success',
            'message' => 'Consumer updated successfully',
        ]);
    }
}
