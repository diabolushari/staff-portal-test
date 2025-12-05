<?php

namespace App\Http\Controllers\BillingCycle;

use App\Http\Controllers\Controller;
use App\Services\Billing\BillService;
use App\Services\BillingGroup\BillingGenerateJobService;
use App\Services\BillingGroup\BillingGroupService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillJobStatusController extends Controller
{

    public function __construct(
        
        private readonly BillingGenerateJobService $billingGenerateJobService,
        private readonly BillService $billService,
        private readonly BillingGroupService $billingGroupService,
    )
    {}

    public function index(): Response
    {
        $billGenerationJobStatus = $this->billingGenerateJobService->listBillGenerationJobStatus(null,null);
        return Inertia::render('BillingCycle/BillJobStatusIndexPage', [
            'bill_generation_job_status' => $billGenerationJobStatus->data
        ]);
    }
    public function show(int $billingGroupId, Request $request): Response
    {
        $readingYearMonth = $request->input('reading_year_month') ?? null;
        $billingGroup = $this->billingGroupService->getBillingGroup($billingGroupId);

        $response = $this->billService->listBills($billingGroupId, $readingYearMonth, null);
        return Inertia::render('BillingCycle/BillJobStatusShowPage', [
            'bills' => $response->data ?? [],
            'billing_group' => $billingGroup->data ?? [],
        ]);
    }
}