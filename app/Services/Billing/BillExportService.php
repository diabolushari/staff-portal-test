<?php

namespace App\Services\Billing;

use App\Services\GrpcServiceResponse;
use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterReadingService;

class BillExportService
{
    public function __construct(
        private readonly BillService $billService,
        private readonly MeterConnectionMappingService $meterConnectionMappingService,
        private readonly MeterReadingService $meterReadingService
    ) {}

    public function getMainMeter(?int $connectionId): ?array
    {
        $meter = null;
        if (!$connectionId) {
            return $meter;
        }
        $meterConnectionMapping = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($connectionId)->data;
        if ($meterConnectionMapping) {
            foreach ($meterConnectionMapping as $mapping) {
                if ($mapping['meter']['meter_profile']['parameter_value'] == 'Main Meter') {
                    $meter = $mapping['meter'];
                }
            }
        }
        return $meter;
    }

    public function getMeterReading(?int $connectionId, ?string $yearMonth): ?array
    {
        $meterReading = null;
        if (!$connectionId) {
            return $meterReading;
        }
        $meterReading = $this->meterReadingService->listMeterReadings(null, null, null, $connectionId, $yearMonth)->data;
        return $meterReading;
    }

    public function filterReadingByParameter(array $meterReading, string $parameterName): array
    {
        if (empty($meterReading)) {
            return [];
        }

        // Each reading object contains "values"
        $values = collect($meterReading[0]['values'] ?? []);

        return $values
            ->filter(function ($value) use ($parameterName) {
                // Match based on meter_profile_parameter.name (kva, kwh, kvarh_lead etc.)
                return strtolower($value['meter_profile_parameter']['name'] ?? '') === strtolower($parameterName);
            })
            ->map(function ($item) {
                return [
                    'timezone'          => $item['time_zone']['parameter_value'] ?? null, // Normal / Peak / Off Peak
                    'timezone_code'     => $item['time_zone']['parameter_code'] ?? null,
                    'initial_reading'   => $item['initial_reading'],
                    'final_reading'     => $item['final_reading'],
                    'difference'        => $item['difference'],
                    'value'             => $item['value'],
                    'parameter_id'      => $item['meter_profile_parameter']['meter_parameter_id'] ?? null,
                    'parameter_name'    => $item['meter_profile_parameter']['name'] ?? null,
                    'parameter_display' => $item['meter_profile_parameter']['display_name'] ?? null,
                ];
            })
            ->values()
            ->toArray();
    }

    public function getChargeHeads(array $chargeHeads): array
    {
        $result = [];

        foreach ($chargeHeads as $item) {
            $name = $item['name'] ?? null;

            if ($name && isset($item['results'][0])) {
                $result[$name] = [
                    'id'      => $item['id'],
                    'name'    => $item['name'],
                    'result'  => $item['results'][0]['result'] ?? null,
                    'zoneId'  => $item['results'][0]['zoneId'] ?? null,
                ];
            }
        }

        return $result;
    }

    public function getComputedProperties(array $computed): array
    {
        $normalized = [];

        foreach ($computed as $item) {

            $name = $item['name'];
            $id = $item['id'];
            $results = $item['results'];

            // Single result → return flat form
            if (count($results) === 1) {
                $normalized[$name] = [
                    'id' => $id,
                    'name' => $name,
                    'result' => $results[0]['result'],
                    'zoneId' => $results[0]['zoneId'],
                ];
            }

            // Multiple → return zone result array
            else {
                $normalized[$name] = [
                    'id' => $id,
                    'name' => $name,
                    'result' => $results
                ];
            }
        }

        return $normalized;
    }

    public function getEnergyChargeRows(array $meter, array $computed, array $filteredkWhs): array
    {
        $mf = $meter['meter_mf'] ?? 1;

        // Get KWH rate from computed
        $kwhRate = $computed['KWH RATE']['result'] ?? 0;

        $energyChargeRows = [];
        $subTotal = 0;

        foreach ($filteredkWhs as $item) {

            $zone = $item['timezone'];      // Normal / Peak / Off peak
            $diff = $item['difference'];
            if ($zone == 'Normal') {
                $diff *= $mf;
            }
            if ($zone == 'Peak') {
                $diff *= $mf * 1.5;
            }
            if ($zone == 'Off Peak') {
                $diff *= $mf * 0.75;
            }    // Raw consumption

            // Rate displayed to UI (kwhRate × MF)
            $displayRate = $kwhRate;

            // Actual charge calculation
            $amount = $diff * $kwhRate;

            $energyChargeRows[] = [
                'label'  => "Energy charges - {$zone}",
                'units'  => $diff,
                'rate'   => number_format($displayRate, 5),
                'amount' => number_format($amount, 2)
            ];

            $subTotal += $amount;
        }

        return [
            'energyChargeRows' => $energyChargeRows,
            'subTotal' => $subTotal
        ];
    }

    public function getAverageAndTotalKva(array $filteredkVAs): array
    {
        $totalKva = array_sum(array_column($filteredkVAs, 'difference'));
        $averageKva = $totalKva / count($filteredkVAs);
        return [
            'totalKva' => $totalKva,
            'averageKva' => $averageKva
        ];
    }
    public function getAverageAndTotalKwh(array $filteredkWhs): array
    {
        $totalKwh = array_sum(array_column($filteredkWhs, 'difference'));
        $averageKwh = $totalKwh / count($filteredkWhs);
        return [
            'totalKwh' => $totalKwh,
            'averageKwh' => $averageKwh
        ];
    }
    public function calculateDemand(array $kvaReadings, float $contractDemand): array
    {
        // Filter timezone readings
        $timezoneReadings = array_filter($kvaReadings, fn($r) => !empty($r['timezone_code']));
        $threshold = $contractDemand * 0.75;

        if (!empty($timezoneReadings)) {

            // Sort into fixed order (Peak, Normal, OffPeak)
            $orderedZones = ['Peak', 'Normal', 'OffPeak'];

            // Create a map for quick lookup
            $zoneMap = [];
            foreach ($timezoneReadings as $r) {
                $zoneMap[$r['timezone']] = $r['value'];
            }

            // Determine max value
            $maxValue = !empty($zoneMap) ? max($zoneMap) : 0;

            // If timezone max beats threshold → use timezone-based calculation
            if ($maxValue > $threshold) {

                $result = [];
                foreach ($orderedZones as $zone) {
                    $value = $zoneMap[$zone] ?? 0;

                    $result[] = [
                        'timezone' => $zone,
                        'value'    => ($value == $maxValue ? $value : 0)
                    ];
                }

                return [
                    'is_contract_demand' => false,
                    'result' => $result
                ];
            }
        }

        // Otherwise → return contract demand only
        return [
            'is_contract_demand' => true,
            'result' => [
                'timezone' => null,
                'value' => $threshold
            ]
        ];
    }
}
