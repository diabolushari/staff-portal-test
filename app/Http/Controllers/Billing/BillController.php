<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\BillExportService;
use App\Services\Billing\BillService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillController extends Controller
{
    public function __construct(
        private readonly BillService $billService,
        private readonly BillExportService $billExportService
    )
    {}

    public function show(int $id): Response
    {   

        $bill = $this->billService->getBill($id);
        $meter = null;
        if ($bill?->data['connection_id']){
            $meter = $this->billExportService->getMainMeter($bill->data['connection_id']);
        }
        $meterReading = null;
        
        if ($bill?->data['connection_id']){
            $meterReading = $this->billExportService->getMeterReading($bill->data['connection_id'], $bill->data['reading_year_month']);
        }
        $kvaValues   = $this->billExportService->filterReadingByParameter($meterReading, 'kva');
        $kvahValues  = $this->billExportService->filterReadingByParameter($meterReading, 'kvah');
        $kwhValues   = $this->billExportService->filterReadingByParameter($meterReading, 'kwh');
        $lagValues   = $this->billExportService->filterReadingByParameter($meterReading, 'kvarh_lag');
        $leadValues  = $this->billExportService->filterReadingByParameter($meterReading, 'kvarh_lead');
        $chargeHeads = $this->billExportService->getChargeHeads($bill->data['charge_heads'] ?? []);
        $computedProperties = $this->billExportService->getComputedProperties($bill->data['computed_properties'] ?? []);
        $energyChargeRows = $this->billExportService->getEnergyChargeRows($meter, $computedProperties, $kwhValues);
        $averageAndTotalKva = $this->billExportService->getAverageAndTotalKva($kvaValues);
        $averageAndTotalKwh = $this->billExportService->getAverageAndTotalKwh($kwhValues);
        $demand = $this->billExportService->calculateDemand($kvaValues, $bill->data['connection']['contract_demand_kva_val']);


        return Inertia::render('Bill/BillShowPage', [
            'bill' => $bill->data,
            'meter' => $meter,
            'meterReading' => $meterReading,
            'kvaValues' => $kvaValues,
            'kvahValues' => $kvahValues,
            'kwhValues' => $kwhValues,
            'lagValues' => $lagValues,
            'leadValues' => $leadValues,
            'chargeHeads' => $chargeHeads,
            'computedProperties' => $computedProperties,
            'energyChargeRows' => $energyChargeRows,
            'connection' => $bill->data['connection'] ?? null,
            'consumer' => $bill->data['consumer'] ?? null,
            'averageAndTotalKva' => $averageAndTotalKva,
            'averageAndTotalKwh' => $averageAndTotalKwh,
        ]);
    }
}
