<?php

namespace App\Http\Controllers\Tariff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tariff\TariffConfigFormRequest;
use App\Services\Parameters\ParameterValueService;
use App\Services\Tariff\TariffConfigService;
use App\Services\Tariff\TariffOrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class TariffConfigController extends Controller
{
    public function __construct(
        private TariffOrderService $tariffOrderService,
        private ParameterValueService $parameterValueService,
        private TariffConfigService $tariffConfigService
    ) {}

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $sort = $request->input('sort');
        $sortBy = $request->input('sortBy');
        $pageNumber = $request->input('pageNumber');
        $pageSize = $request->input('pageSize');
        $tariffOrderId = $request->input('tariffOrderId');

        $response = $this->tariffConfigService->listPaginatedTariffConfigs($pageNumber, $pageSize, $tariffOrderId);
        if ($response->hasError()) {
            return redirect()->back()->with('error', $response->error);
        }

        $paginatedData = null;
        if (! empty($response->data)) {
            $paginatedData = new LengthAwarePaginator(
                $response->data['tariff_configs'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }

        return Inertia::render('TariffConfig/TariffConfigIndexPage', [
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'sortBy' => $sortBy,
            ],
            'tariff_configs' => $paginatedData,
        ]);
    }

    public function create(Request $request): Response
    {
        $tariffOrder = $this->tariffOrderService->listTariffOrders();

        $consumptionTariff = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Tariff'
        );
        $connectionPurpose = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Connection',
            'Primary Purpose'
        );

        return Inertia::render('TariffConfig/TariffConfigCreatePage', [
            'tariff_order' => $tariffOrder->data['tariff_orders'] ?? [],
            'consumption_tariff' => $consumptionTariff->data,
            'connection_purpose' => $connectionPurpose->data,
        ]);
    }

    public function store(TariffConfigFormRequest $request): RedirectResponse
    {
        $response = $this->tariffConfigService->createTariffConfig($request);

        if ($response->hasError()) {
            return redirect()->back()->with('error', $response->error);
        }

        return redirect()->route('tariff-config.index');
    }

    public function show(Request $request): Response
    {
        return Inertia::render('TariffConfig/TariffConfigShowPage');
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('TariffConfig/TariffConfigCreatePage');
    }

    public function update(Request $request): RedirectResponse
    {
        return redirect()->route('tariff-config.index');
    }

    public function destroy(Request $request): RedirectResponse
    {
        return redirect()->route('tariff-config.index');
    }
}
