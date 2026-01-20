<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Services\Billing\BillExportService;
use App\Services\Billing\BillService;
use Inertia\Inertia;
use Inertia\Response;

class BillController extends Controller
{
    public function __construct(
        private readonly BillService $billService,
        private readonly BillExportService $billExportService
    ) {}

    public function show(int $id): Response
    {

        $bill = $this->billService->getBill($id);
        $energyMeter = null;
        $selfGenerationMeter = null;
        if (isset($bill?->data['connection_id']) && $bill->data['connection_id']) {
            $energyMeter = $this->billExportService->getEnergyConsumptionMeter($bill->data['connection_id']);
            $selfGenerationMeter = $this->billExportService->getSelfGenerationMeter($bill->data['connection_id']);
        }
        $meterReading = null;

        if (isset($bill?->data['connection_id']) && $bill->data['connection_id'] && isset($bill?->data['reading_year_month']) && $bill->data['reading_year_month']) {
            $meterReading = $this->billExportService->getMeterReading($bill->data['connection_id'], $bill->data['reading_year_month']);
        }

        $selfGenerationkwhValues = $this->billExportService->filterReadingByParameter($meterReading, 'kwh', $selfGenerationMeter['meter']['meter_id'] ?? null);
        $kvaValues = $this->billExportService->filterReadingByParameter($meterReading, 'kva', $energyMeter['meter']['meter_id'] ?? null);
        $kvahValues = $this->billExportService->filterReadingByParameter($meterReading, 'kvah', $energyMeter['meter']['meter_id'] ?? null);
        $kwhValues = $this->billExportService->filterReadingByParameter($meterReading, 'kwh', $energyMeter['meter']['meter_id'] ?? null);
        $lagValues = $this->billExportService->filterReadingByParameter($meterReading, 'kVA(R)h Lag', $energyMeter['meter']['meter_id'] ?? null);
        $leadValues = $this->billExportService->filterReadingByParameter($meterReading, 'kVA(R)h Lead', $energyMeter['meter']['meter_id'] ?? null);
        $chargeHeads = $this->billExportService->getChargeHeads($bill->data['charge_heads'] ?? []);
        $computedProperties = $this->billExportService->getComputedProperties($bill->data['computed_properties'] ?? []);
        $energyChargeRows = $this->billExportService->getEnergyChargeRows($energyMeter, $computedProperties, $kwhValues);
        $averageAndTotalKva = $this->billExportService->getAverageAndTotalKva($kvaValues);
        $averageAndTotalKwh = $this->billExportService->getAverageAndTotalKwh($kwhValues);
        $demand = $this->billExportService->calculateDemand($kvaValues, $bill?->data['connection']['contract_demand_kva_val'] ?? 0);
        $totalDemandChargeRows = $this->billExportService->getTotolDemandChargeRows($computedProperties);
        $totalEnergyChargeRows = $this->billExportService->getTotalEnergyChargeRows($computedProperties, $kwhValues);

        return Inertia::render('Bill/BillShowPage', [
            'bill' => $bill->data,
            'meter' => $energyMeter,
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
            'consumer' => $bill->data['connection']['consumer_profiles'][0] ?? null,
            'averageAndTotalKva' => $averageAndTotalKva,
            'averageAndTotalKwh' => $averageAndTotalKwh,
            'demand' => $demand,
            'totalDemandCharge' => $totalDemandChargeRows,
            'totalEnergyCharge' => $totalEnergyChargeRows,
            'selfGenerationkwhValues' => $selfGenerationkwhValues,
        ]);
    }
}
