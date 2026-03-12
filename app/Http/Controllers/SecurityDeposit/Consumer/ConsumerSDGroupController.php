<?php

namespace App\Http\Controllers\SecurityDeposit\Consumer;

use App\Http\Controllers\Controller;
use App\Services\BillingGroup\BillGenerationJobService;
use App\Services\BillingGroup\BillingGroupService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class ConsumerSDGroupController extends Controller
{
    public function __construct(
        private readonly BillingGroupService $billingGroupService,
        private readonly BillGenerationJobService $billingGenerateJobService) {}

    public function index(Request $request): Response
    {
        $search = $request->input('search') ?? null;
        $pageNumber = $request->input('page') ?? 1;
        $pageSize = $request->input('page_size') ?? 10;
        $sortBy = $request->input('sort_by') ?? null;
        $sortDirection = $request->input('sort_direction') ?? null;
        $response = $this->billingGroupService->listPaginatedBillingGroups($pageNumber, $pageSize, $search, $sortBy, $sortDirection);

        $paginated = null;
        if (! empty($response->data)) {
            $paginated = new LengthAwarePaginator(
                $response->data['groups'],
                $response->data['total_count'],
                $response->data['page_size'],
                $response->data['page_number'],
                ['path' => request()->url()]
            );
        }

        return Inertia::render('SecurityDeposit/Consumer/ConsumerSDGroupIndexPage', [
            'groups' => $paginated,
            'oldSearch' => $search,
        ]);
    }

    public function show(int $id)
    {
        $response = $this->billingGroupService->getBillingGroup(null, $id);

        if ($response->hasValidationError()) {
            return $response->error ?? redirect()->back()->with(['error' => 'Failed to get billing group']);
        }

        return Inertia::render('SecurityDeposit/Consumer/ConsumerSDGroupShowPage', [
            'group' => $response->data,
        ]);
    }
}
