<?php

namespace App\Http\Controllers\VariableRate;

use App\Http\Controllers\Controller;
use App\Http\Requests\VariableRate\VariableRateFormRequest;
use App\Services\Parameters\ParameterDefinitionService;
use App\Services\VariableRate\VariableRateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class VariableRateController extends Controller
{
    public function __construct(
        private VariableRateService $variableRateService,
        private ParameterDefinitionService $parameterDefinitionService
    ) {}

    public function index(Request $request): Response
    {
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $orderDescriptor = $request->input('search') ?? null;
        $orderBy = $request->input('order_by') ?? null;
        $orderDirection = $request->input('order_direction') ?? null;

        $variableRateResponse = $this->variableRateService->listPaginatedVariableRates(
            $pageNumber,
            $pageSize,
            $orderBy,
            $orderDescriptor,
            $orderDirection
        );
        $paginated = null;
        if (! empty($variableRateResponse->data)) {
            $paginated = new LengthAwarePaginator(
                $variableRateResponse->data['variable_rates'],
                $variableRateResponse->data['total_count'],
                $variableRateResponse->data['page_size'],
                $variableRateResponse->data['page_number'],
                ['path' => request()->url()]
            );
        }

        $variableRateParameter = $this->parameterDefinitionService->getParameterDefinition(
            null,
            'Billing',
            'Variable Rate',
            'Billing'
        );


        return Inertia::render('VariableRate/VariableRateIndexPage', [
            'variableRateParameter' => $variableRateParameter->data,
            'variableRates' => $paginated ?? [],
            'filters' => [
                'search' => $orderDescriptor,
                'order_by' => $orderBy,
                'order_direction' => $orderDirection,
            ],
        ]);
    }

    public function store(VariableRateFormRequest $request): RedirectResponse
    {
        $this->variableRateService->createVariableRate($request);

        return redirect()->route('variable-rates.index');
    }

    public function update(VariableRateFormRequest $request): RedirectResponse
    {
        $this->variableRateService->updateVariableRate($request);

        return redirect()->route('variable-rates.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->variableRateService->deleteVariableRate($id);

        return redirect()->route('variable-rates.index');
    }
}
