<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Billing\BillInitializeFormRequest;
use App\Services\Billing\BillInitializeService;
use Illuminate\Http\RedirectResponse;

class BillInitializeController extends Controller
{
    public function __construct(
        private readonly BillInitializeService $billInitializeService
    ) {}

    public function __invoke(BillInitializeFormRequest $request): RedirectResponse
    {
        $response = $this->billInitializeService->initializeBill($request);

        if ($response->hasError()) {
            return $response->error ?? redirect()->back()->with(['error' => 'Something went wrong']);
        }

        return redirect()->route('job-status.show', [
            'job_status' => $request->billingGroupId ?? null,
            'bill_year_month' => $request->billMonthYear . '-01',
            'reading_year_month' => $request->readingMonthYear . '-01',
            'initialized_date' => now()->format('Y-m-d'),
        ])->with(['message' => 'Bill initialized successfully']);
    }
}
