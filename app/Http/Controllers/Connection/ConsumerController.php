<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionService;
use App\Services\Parameters\ParameterValueService;
use Inertia\Inertia;

class ConsumerController extends Controller
{
    public function __construct(
        private readonly ConnectionService $connectionService,
        private readonly ParameterValueService $parameterValueService,
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

        return Inertia::render('Consumer/ConsumerForm', [
            'consumer_types' => $consumerTypes->data,
        ]);
    }
}
