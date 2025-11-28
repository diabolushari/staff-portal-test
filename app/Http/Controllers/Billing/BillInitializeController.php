<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Billing\BillInitializeFormRequest;
use App\Services\Billing\BillInitializeService;

class BillInitializeController extends Controller
{
    public function __construct(
        private readonly BillInitializeService $billInitializeService
    ) {}

    public function __invoke(BillInitializeFormRequest $request)
    {
        $response = $this->billInitializeService->initializeBill($request);

        return response()->json($response);
    }
}
