<?php

namespace App\Http\Controllers\BillingGroup;

use App\Http\Controllers\Controller;
use App\Http\Requests\BillingGroup\BillingGroupFormRequest;
use App\Services\BillingGroup\BillingGroupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingGroupController extends Controller
{
    public function __construct(
        private readonly BillingGroupService $billingGroupService
    ) {}

    public function index(): Response
    {
        $response = $this->billingGroupService->listBillingGroups();

        if ($response->data === null) {
            return Inertia::render('BillingGroup/BillingGroupIndexPage');
        }

        return Inertia::render('BillingGroup/BillingGroupIndexPage', [
            'billingGroups' => $response->data,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('BillingGroup/BillingGroupCreatePage');
    }

    public function store(BillingGroupFormRequest $request): RedirectResponse
    {
        $response = $this->billingGroupService->createBillingGroup($request);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to create billing group');
        }

        return redirect()->route('billing-groups.index')->with('message', 'Billing group created successfully');
    }

    public function show(int $id, Request $request): Response
    {
        $search = $request->get('search');
        $response = $this->billingGroupService->getBillingGroup($id);

        return Inertia::render('BillingGroup/BillingGroupShowPage', [
            'billingGroup' => $response->data ?? null,
        ]);
    }

    public function destroy(int $versionId): RedirectResponse
    {
        $deletedBy = auth()->id();
        $response = $this->billingGroupService->deleteBillingGroup($versionId, $deletedBy);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to delete billing group');
        }

        return redirect()->route('billing-groups.index');
    }
}
