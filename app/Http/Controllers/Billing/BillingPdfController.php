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
        $energyMeter = null;
        $selfGenerationMeter = null;
        if (isset($bill?->data['connection_id']) && $bill->data['connection_id']) {
            $energyMeter = $this->billExportService->getEnergyConsumptionMeter($bill->data['connection_id']);
            $selfGenerationMeter = $this->billExportService->getSelfGenerationMeter($bill->data['connection_id']);
        }
        $meterReading = null;

        if ($bill?->data['connection_id']) {
            $meterReading = $this->billExportService->getMeterReading($bill->data['connection_id'], $bill->data['reading_year_month']);
        }
        $chargeHeads = $this->billExportService->getChargeHeads($bill->data['charge_heads'] ?? []);
        $computedProperties = $this->billExportService->getComputedProperties($bill->data['computed_properties'] ?? []);
        $timezones = $this->billExportService->splitTimeZones($computedProperties['timezones'] ?? []);
        $selfGenerationkwhValues = $this->billExportService->filterReadingByParameter($meterReading, 'kwh', $selfGenerationMeter['meter']['meter_id'] ?? null, $timezones);
        $kvaValues = $this->billExportService->filterReadingByParameter($meterReading, 'kva', $energyMeter['meter']['meter_id'] ?? null, $timezones);
        $kvahValues = $this->billExportService->filterReadingByParameter($meterReading, 'kvah', $energyMeter['meter']['meter_id'] ?? null, $timezones);
        $kwhValues = $this->billExportService->filterReadingByParameter($meterReading, 'kwh', $energyMeter['meter']['meter_id'] ?? null, $timezones);
        $lagValues = $this->billExportService->filterReadingByParameter($meterReading, 'kVA(R)h Lag', $energyMeter['meter']['meter_id'] ?? null, $timezones);
        $leadValues = $this->billExportService->filterReadingByParameter($meterReading, 'kVA(R)h Lead', $energyMeter['meter']['meter_id'] ?? null, $timezones);
        $averageAndTotalKva = $this->billExportService->getAverageAndTotalKva($kvaValues);
        $averageAndTotalKwh = $this->billExportService->getAverageAndTotalKwh($kwhValues);
        $demand = $this->billExportService->calculateDemand($kvaValues, $bill?->data['connection']['contract_demand_kva_val'] ?? 0);
        $totalDemandChargeRows = $this->billExportService->getTotolDemandChargeRows($computedProperties, $kvaValues, $timezones);
        $totalEnergyChargeRows = $this->billExportService->getTotalEnergyChargeRows($computedProperties, $kwhValues, $timezones);
        $billNumber = $this->billExportService->generateBillNumber($bill->data);
        $billWithNumber = null;
        if ($bill->data) {
            $billWithNumber = $bill->data;
            $billWithNumber['bill_number'] = $billNumber;
        };
        $amountInWords = $this->billExportService->getAmountInWords($bill->data['bill_amount'] ?? null);
        $pdf = Pdf::loadView('billing/bill-template', [
            'kvaValues' => $kvaValues ?? [],
            'kvahValues' => $kvahValues ?? [],
            'kwhValues' => $kwhValues ?? [],
            'lagValues' => $lagValues ?? [],
            'leadValues' => $leadValues ?? [],
            'bill' => $billWithNumber ?? [],
            'connection' => $bill->data['connection'] ?? [],
            'consumer' => $bill->data['connection']['consumer_profiles'][0] ?? [],
            'meter' => $energyMeter ?? [],
            'chargeHeads' => $chargeHeads,
            'computedProperties' => $computedProperties,
            'averageAndTotalKva' => $averageAndTotalKva,
            'averageAndTotalKwh' => $averageAndTotalKwh,
            'demand' => $demand,
            'totalDemandChargeRows' => $totalDemandChargeRows,
            'totalEnergyChargeRows' => $totalEnergyChargeRows,
            'selfGenerationkwhValues' => $selfGenerationkwhValues,
            'amountInWords' => $amountInWords,
        ]);
        $pdf->setPaper([0, 0, 612, 1008], 'portrait');


        return $pdf->stream('bill.pdf');
        // return view('billing/bill-template');
    }
}
