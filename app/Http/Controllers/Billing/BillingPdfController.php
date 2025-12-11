<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class BillingPdfController extends Controller
{
    public function index(Request $request)
    {

        $data = json_decode($request->data);

        $filteredkVA = collect($data)
            ->whereIn('title', ['kVA'])
            ->values();
        $filteredKVAh = collect($data)
            ->whereIn('title', ['kVAh'])
            ->values();
        $filteredkWh = collect($data)
            ->whereIn('title', ['kWh'])
            ->values();
        $filteredLag = collect($data)
            ->whereIn('title', ['kVArh_lag'])
            ->values();
        $filteredLead = collect($data)
            ->whereIn('title', ['kVArh_lead'])
            ->values();

        $pdf = Pdf::loadView('billing/bill-template', [
            'filteredkVAs' => $filteredkVA ?? [], 
            'filteredKVAhs' => $filteredKVAh ?? [],
            'filteredkWhs' => $filteredkWh ?? [],
            'filteredLags' => $filteredLag ?? [],
            'filteredLeads' => $filteredLead ?? []
        ]);

        return $pdf->stream('bill.pdf');
        // return view('billing/bill-template');
    }
}
