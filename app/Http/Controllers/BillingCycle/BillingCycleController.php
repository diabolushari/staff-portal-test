<?php

namespace App\Http\Controllers\BillingCycle;

use App\Http\Controllers\Controller;
use App\Services\BillingGroup\BillingGroupService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingCycleController extends Controller
{

    public function __construct(
        private readonly BillingGroupService $billingGroupService
    )
    {}

    public function index(): Response
    {
        $billingGroups = $this->billingGroupService->listBillingGroups();
        return Inertia::render('BillingCycle/BillingCycleIndexPage', [
            'billing_groups' => $billingGroups->data
        ]);
    }
    public function show(int $id): Response
    {
        $billingGroup = $this->billingGroupService->getBillingGroup($id);
        return Inertia::render('BillingCycle/BillingCycleShowPage');
    }
}