<?php

namespace App\Http\Controllers\Tariff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tariff\TariffOrderFormRequest;
use App\Http\Requests\Tariff\TariffOrderUpdateFormRequest;
use App\Services\Tariff\TariffOrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class TariffOrderController extends Controller
{
    public function __construct(
        private readonly TariffOrderService $tariffOrderService
    ) {}

    public function index(Request $request): Response
    {
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $orderDescriptor = $request->input('search') ?? null;
        $orderBy = $request->input('order_by') ?? null;
        $orderDirection = $request->input('order_direction') ?? null;

        $response = $this->tariffOrderService->listTariffOrders(
            pageNumber: $pageNumber,
            pageSize: $pageSize,
            orderDescriptor: $orderDescriptor,
            orderBy: $orderBy,
            orderDirection: $orderDirection
        );
        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['tariff_orders'],                // items for this page
                $response->data['total_count'],            // total items count
                $response->data['page_size'],              // items per page
                $response->data['page_number'],            // current page
                ['path' => request()->url()]              // so pagination links work properly
            );
        }

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return Inertia::render('TariffOrder/TariffOrderIndexPage', [
            'tariffOrders' => $paginated ?? [],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('TariffOrder/TariffOrderCreatePage');
    }

    public function store(TariffOrderFormRequest $request): RedirectResponse
    {
        $response = $this->tariffOrderService->createTariffOrder($request);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to create tariff order');
        }

        return redirect()->route('tariff-order.index');
    }

    public function show(int $id): Response
    {
        return Inertia::render('TariffOrder/TariffOrderShowPage');
    }

    public function edit(int $id): Response|RedirectResponse
    {
        $response = $this->tariffOrderService->getTariffOrder($id);
        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->withErrors([
                'message' => $response->statusDetails ?? 'Unknown error',
            ]);
        }

        return Inertia::render('TariffOrder/TariffOrderCreatePage', [
            'tariff_order' => $response->data,
        ]);
    }

    public function update(TariffOrderUpdateFormRequest $request, int $id): RedirectResponse
    {
        $response = $this->tariffOrderService->updateTariffOrder($request);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to update tariff order');
        }

        return redirect()->route('tariff-order.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $response = $this->tariffOrderService->deleteTariffOrder($id);
        if ($response->hasError()) {
            return redirect()->back()->with('error', 'Failed to delete tariff order');
        }

        return redirect()->route('tariff-order.index');
    }
}
