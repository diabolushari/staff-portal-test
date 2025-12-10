<?php

namespace App\Http\Controllers\BillingGroup;

use App\Http\Requests\BillingGroup\BillingGroupConnectionRelFormRequest;
use App\Services\BillingGroup\BillingGroupConnectionRelService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class BillingGroupConnectionRelController
{
    public function __construct(private BillingGroupConnectionRelService $billingGroupConnectionRelService) {}

    public function index()
    {
        return Inertia::render('BillingGroupConnectionRel/BillingGroupConnectionRelIndexPage', [
            'billingGroupConnectionRel' => $response->data,
        ]);
    }

    public function create()
    {
        return Inertia::render('BillingGroupConnectionRel/BillingGroupConnectionRelCreatePage');
    }

    public function store(BillingGroupConnectionRelFormRequest $request): RedirectResponse
    {
        $response = $this->billingGroupConnectionRelService->createBillingGroupConnectionRel($request);

        if ($response->statusCode !== 0) {
            return redirect()->back()->with('error', $response->statusDetails);
        }

        return redirect()->back()->with('message', 'Connection added to Billing Group');
    }

    public function show(int $billingGroupId)
    {
        $response = $this->billingGroupConnectionRelService->getBillingGroupConnectionRel($billingGroupId);

        if (! $response->success) {
            return back()->withErrors($response->errors);
        }

        return Inertia::render('BillingGroupConnectionRel/BillingGroupConnectionRelShowPage', [
            'billingGroupConnectionRel' => $response->data,
        ]);
    }

    public function destroy(int $versionId): RedirectResponse
    {
        $this->billingGroupConnectionRelService->deleteBillingGroupConnectionRel($versionId);

        return back()->with('success', 'Connection removed from Billing Group');
    }
}
