<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\BillExportService;
use App\Services\Billing\BillService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class BillingPdfController extends Controller
{
    public function __construct(
        private readonly BillService $billService,
        private readonly BillExportService $billExportService
    ) {}

    public function index(int $billId): Response
    {

        $bill = $this->billService->getBill($billId);
        $meter = null;
        if ($bill?->data['connection_id']) {
            $meter = $this->billExportService->getEnergyConsumptionMeter($bill->data['connection_id']);
        }
        $meterReading = null;

        if ($bill?->data['connection_id']) {
            $meterReading = $this->billExportService->getMeterReading($bill->data['connection_id'], $bill->data['reading_year_month']);
        }
        $kvaValues   = $this->billExportService->filterReadingByParameter($meterReading, 'kva', $meter['meter']['meter_id'] ?? null);
        $kvahValues  = $this->billExportService->filterReadingByParameter($meterReading, 'kvah', $meter['meter']['meter_id'] ?? null);
        $kwhValues   = $this->billExportService->filterReadingByParameter($meterReading, 'kwh', $meter['meter']['meter_id'] ?? null);
        $lagValues   = $this->billExportService->filterReadingByParameter($meterReading, 'kVA(R)h Lag', $meter['meter']['meter_id'] ?? null);
        $leadValues  = $this->billExportService->filterReadingByParameter($meterReading, 'kVA(R)h Lead', $meter['meter']['meter_id'] ?? null);
        $chargeHeads = $this->billExportService->getChargeHeads($bill->data['charge_heads'] ?? []);
        $computedProperties = $this->billExportService->getComputedProperties($bill->data['computed_properties'] ?? []);
        $energyChargeRows = $this->billExportService->getEnergyChargeRows($meter, $computedProperties, $kwhValues);
        $averageAndTotalKva = $this->billExportService->getAverageAndTotalKva($kvaValues);
        $averageAndTotalKwh = $this->billExportService->getAverageAndTotalKwh($kwhValues);
        $totalDemandChargeRows = $this->billExportService->getTotolDemandChargeRows($computedProperties);
        $totalEnergyChargeRows = $this->billExportService->getTotalEnergyChargeRows($computedProperties, $kwhValues);
        $demand = $this->billExportService->calculateDemand($kvaValues, $bill->data['connection']['contract_demand_kva_val'] ?? null);
        $pdf = Pdf::loadView('billing/bill-template', [
            'kvaValues' => $kvaValues ?? [],
            'kvahValues' => $kvahValues ?? [],
            'kwhValues' => $kwhValues ?? [],
            'lagValues' => $lagValues ?? [],
            'leadValues' => $leadValues ?? [],
            'bill' => $bill->data ?? [],
            'connection' => $bill->data['connection'] ?? [],
            'consumer' => $bill->data['connection']['consumer_profiles'][0] ?? [],
            'meter' => $meter ?? [],
            'chargeHeads' => $chargeHeads,
            'computedProperties' => $computedProperties,
            'energyChargeRows' => $energyChargeRows,
            'averageAndTotalKva' => $averageAndTotalKva,
            'averageAndTotalKwh' => $averageAndTotalKwh,
            'demand' => $demand,
            'totalDemandChargeRows' => $totalDemandChargeRows,
            'totalEnergyChargeRows' => $totalEnergyChargeRows,
        ]);


        return $pdf->stream('bill.pdf');
        // return view('billing/bill-template');
    }
}
