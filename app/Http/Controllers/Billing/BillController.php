<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\BillService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillController extends Controller
{
    public function __construct(
        private readonly BillService $billService
    )
    {}

    public function show(int $id): Response
    {   
        $bill = $this->billService->getBill($id);
        return Inertia::render('Bill/BillShowPage', [
            'bill' => $bill->data
        ]);
    }
}
