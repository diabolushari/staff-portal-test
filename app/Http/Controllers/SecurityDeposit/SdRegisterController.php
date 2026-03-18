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
        $sdRegisters = $this->sdRegisterService->listPaginatedSdRegisters(null, null, null, null, null);
        $paginated = null;

        if (! empty($sdRegisters->data)) {
            $paginated = new LengthAwarePaginator(
                $sdRegisters->data['sd_registers'],
                $sdRegisters->data['total_count'],
                $sdRegisters->data['page_size'],
                $sdRegisters->data['page_number'],
                ['path' => request()->url()]
            );
        }

        return Inertia::render('SecurityDeposit/SdRegister/SdRegisterIndex', [
            'sdRegisters' => $paginated,
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
