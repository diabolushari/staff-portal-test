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
            return $response->error ?? redirect()->back()->with(['error', "Something went wrong"]);
        }
        if ($response->data == null) {
            return redirect()->back()->with(['error', "Failed to initialize bill"]);
        }
        return redirect()->back()->with(['message', "Bill initialized successfully"]);
    }
}
