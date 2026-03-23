<?php

namespace App\Http\Controllers\SecurityDeposit;

use App\Http\Controllers\Controller;
use App\Services\Billing\ChargeHeadDefinitionService;
use App\Services\Connection\ConnectionService;
use App\Services\Parameters\ParameterValueService;
use App\Services\SecurityDeposit\SdBalanceSummaryService;
use App\Services\SecurityDeposit\SdRegisterService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class SdRegisterController extends Controller
{
    public function __construct(
        private readonly SdRegisterService $sdRegisterService,
        private readonly ConnectionService $connectionService,
        private readonly SdBalanceSummaryService $sdBalanceSummaryService,
        private readonly ParameterValueService $parameterValueService,
        private readonly ChargeHeadDefinitionService $chargeHeadDefinitionService,
    ) {}

    public function index()
    {

        $response = $this->connectionService->listConnectionWithActiveBalanceSummary(
            connectionId: null,
            pageNumber: 1,
            pageSize: 10,
        );
        $paginated = null;

        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['connectionArray'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }

        return Inertia::render('SecurityDeposit/SdRegister/SdRegisterIndex', [
            'connections' => $paginated,
        ]);
    }

    public function show(int $id, Request $request)
    {
        $sdRegister = $this->sdRegisterService->getSdRegisterByConnectionId($id)->data;
        $connection = $this->connectionService->getConnection($id)->data;
        $balanceSummary = $this->sdBalanceSummaryService->getbalanceSummaryByConnectionId($id)->data;
        $occupancyTypes = $this->parameterValueService->getParameterValues(
            null,
            null,
            null,
            'Connection',
            'SD Occupancy Type'
        )->data;
        $sdTypes = $this->chargeHeadDefinitionService->listChargeHeadByCategory('Security Deposit')->data;
        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);

        return Inertia::render('SecurityDeposit/SdRegister/SdRegisterShow', [
            'sdRegister' => $sdRegister,
            'connection' => $connection,
            'balanceSummary' => $balanceSummary,
            'occupancyTypes' => $occupancyTypes,
            'sdTypes' => $sdTypes,
            'page' => $page,
            'pageSize' => $pageSize,
        ]);
    }
}
