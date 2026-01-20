<?php

namespace App\Services\Billing;

use App\Services\Metering\MeterConnectionMappingService;
use App\Services\Metering\MeterReadingService;
use Spatie\LaravelData\Attributes\Validation\InArray;

class BillExportService
{
    public function __construct(
        private readonly BillService $billService,
        private readonly MeterConnectionMappingService $meterConnectionMappingService,
        private readonly MeterReadingService $meterReadingService
    ) {}

    public function getEnergyConsumptionMeter(?int $connectionId): ?array
    {
        $meter = [];
        if (! $connectionId) {
            return $meter;
        }
        $meterConnectionMapping = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($connectionId)->data;
        if ($meterConnectionMapping) {
            foreach ($meterConnectionMapping as $mapping) {
                if (strtolower($mapping['meter_use_category']['parameter_value']) == 'energy consumption') {
                    $meter['meter'] = $mapping['meter'];
                    $meter['meter_mf'] = $mapping['meter_mf'];
                }
            }
        }

        return $meter;
    }

    public function getSelfGenerationMeter(?int $connectionId): ?array
    {
        $meter = [];
        if (! $connectionId) {
            return $meter;
        }
        $meterConnectionMapping = $this->meterConnectionMappingService->getMeterConnectionMappingByConnectionId($connectionId)->data;
        if ($meterConnectionMapping) {
            foreach ($meterConnectionMapping as $mapping) {
                if (strtolower($mapping['meter_use_category']['parameter_value']) == 'self generation') {
                    $meter['meter'] = $mapping['meter'];
                    $meter['meter_mf'] = $mapping['meter_mf'];
                }
            }
        }

        return $meter;
    }

    public function getMeterReading(?int $connectionId, ?string $yearMonth): ?array
    {
        $meterReading = null;
        if (! $connectionId) {
            return $meterReading;
        }
        $meterReading = $this->meterReadingService->listMeterReadings(null, null, null, $connectionId, $yearMonth)->data;

        return $meterReading;
    }

    public function filterReadingByParameter(
        ?array $meterReading,
        ?string $parameterName,
        $energyConsumptionMeterId
    ): array {
        if (empty($meterReading) || empty($parameterName) || empty($energyConsumptionMeterId)) {
            return [];
        }

        // Each reading object contains "values"
        $values = collect($meterReading[0]['values'] ?? []);

        $unsortedValues = $values
            ->filter(function ($value) use ($parameterName, $energyConsumptionMeterId) {

                $parameterMatch =
                    strtolower($value['meter_profile_parameter']['name'] ?? '') === strtolower($parameterName);

                $meterMatch =
                    ($value['meter_id'] ?? null) == $energyConsumptionMeterId;
                $parameterIsExport = $value['meter_profile_parameter']['is_export'] ?? false;

                return $parameterMatch && $meterMatch && !$parameterIsExport;
            })
            ->map(function ($item) {
                return [
                    'timezone_id'       => $item['timezone_id'] ?? null,
                    'timezone'          => $item['time_zone']['parameter_value'] ?? null,
                    'timezone_code'     => $item['time_zone']['parameter_code'] ?? null,
                    'initial_reading'   => $item['initial_reading'] ?? null,
                    'final_reading'     => $item['final_reading'] ?? null,
                    'difference'        => $item['difference'] ?? null,
                    'meter_mf'          => $item['meter_mf'] ?? null,
                    'value'             => $item['value'] ?? null,
                    'parameter_id'      => $item['meter_profile_parameter']['meter_parameter_id'] ?? null,
                    'parameter_name'    => $item['meter_profile_parameter']['name'] ?? null,
                    'parameter_display' => $item['meter_profile_parameter']['display_name'] ?? null,
                ];
            })
            ->values()
            ->toArray();


        $sortedValues = [];
        $timeZoneNames = ['normal', 'peak', 'off peak'];
        foreach ($timeZoneNames as $timeZoneName) {
            foreach ($unsortedValues as $value) {
                if (strtolower($value['timezone']) == $timeZoneName) {
                    $sortedValues[] = $value;
                }
            }
        }
        foreach ($unsortedValues as $value) {
            if (!in_array(strtolower($value['timezone']), $timeZoneNames)) {
                $sortedValues[] = $value;
            }
        }

        return $sortedValues;
    }




    public function getChargeHeads(array $chargeHeads): array
    {
        $result = [];

        foreach ($chargeHeads as $item) {
            $name = $item['name'] ?? null;
            $key = $this->toSnakeCase($name);

            if ($name && isset($item['results'][0])) {
                $result[$key] = [
                    'id' => $item['id'],
                    'name' => $name,
                    'result' => $item['results'][0]['result'] ?? null,
                    'zoneId' => $item['results'][0]['zoneId'] ?? null,
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
            $key = $this->toSnakeCase($name);
            $id = $item['id'];
            $results = $item['results'];

            // Single result → return flat form
            if (count($results) === 1) {
                $normalized[$key] = [
                    'id' => $id,
                    'name' => $name,
                    'result' => $results[0]['result'],
                    'zoneId' => $results[0]['zoneId'],
                ];
            }

            // Multiple → return zone result array
            else {
                $normalized[$key] = [
                    'id' => $id,
                    'name' => $name,
                    'result' => $results,
                ];
            }
        }

        return $normalized;
    }

    public function getEnergyChargeRows(?array $meter, ?array $computed, ?array $filteredkWhs): ?array
    {
        if (empty($meter) || empty($computed) || empty($filteredkWhs)) {
            return [];
        }
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
                'label' => "Energy charges - {$zone}",
                'units' => $diff,
                'rate' => number_format($displayRate, 5),
                'amount' => number_format($amount, 2),
            ];

            $subTotal += $amount;
        }

        return [
            'energyChargeRows' => $energyChargeRows,
            'subTotal' => $subTotal,
        ];
    }

    public function getTotolDemandChargeRows(?array $computed): array
    {
        if (empty($computed)) {
            return [];
        }

        $excessDemand = $computed['excess_demand'];
        $zoneWithMaxDemand = $computed['zone_with_max_demand_value'] ?? [];
        $recordedMaxDemand = $computed['recorded_max_demand'] ?? [];
        $contract75 = $computed['75_of_contract_demand'] ?? [];
        $demandRate = $computed['kva_rate']['result'] ?? 0;
        $excessDemandRate = $computed['excess_demand_rate']['result'] ?? 0;
        $demandChargeHead = $computed['demand_charge'] ?? [];
        $excessDemandHead = $computed['excess_demand_charge'] ?? [];

        if (! $excessDemand || empty($excessDemand['result'])) {
            return [];
        }

        $demandRows = [];
        $excessRows = [];
        $zonesCount = count($excessDemand['result']);

        $useContractDemand =
            empty($zoneWithMaxDemand['result']) ||
            $zoneWithMaxDemand['result'] === 'Contract Demand';

        $demandUnits = $useContractDemand
            ? (float) ($contract75['result'] ?? 0)
            : (float) ($recordedMaxDemand['result'] ?? 0);

        $zoneWithMaxExcessDemand = null;
        $previousMax = 0;
        foreach ($excessDemand['result'] as $index => $zoneData) {
            $zoneId = $zoneData['zoneId'] ?? $index;
            if ((float) ($zoneData['result'] ?? 0) > $previousMax) {
                $previousMax = (float) ($zoneData['result'] ?? 0);
                $zoneWithMaxExcessDemand = $zoneId;
            }
        }

        foreach ($excessDemand['result'] as $index => $zoneData) {

            $zoneId = $zoneData['zoneId'] ?? $index;
            $units = 0;
            $demandChargeAmount = 0;

            if (($useContractDemand && $zoneId == 1) || (! $useContractDemand && $zoneId == $zoneWithMaxDemand['result'])) {
                $units = $demandUnits;
                $demandChargeAmount = $demandChargeHead ? (float) ($demandChargeHead['result'] ?? 0) : 0;
            }

            $demandRows[] = [
                'label' => $this->getZoneLabel($index, 'Demand Charge'),
                'zone' => $zoneId,
                'units' => $units,
                'rate' => $demandRate,
                'amount' => $demandChargeAmount,
            ];

            $excessUnits = (float) ($zoneData['result'] ?? 0);

            $excessRows[] = [
                'label' => $this->getZoneLabel($index, 'Excess Demand Charge'),
                'zone' => $zoneId,
                'units' => $zoneId == $zoneWithMaxExcessDemand ? $excessUnits : 0,
                'rate' => $excessDemandRate,
                'amount' => $zoneId == $zoneWithMaxExcessDemand ? (float) ($excessDemandHead['result'] ?? 0) : 0,
            ];
        }

        return [
            'title' => 'Total Demand Charge',
            'rows' => array_merge($demandRows, $excessRows),
        ];
    }

    public function getTotalEnergyChargeRows(array $computed, array $kwhValues): ?array
    {

        if (empty($computed) || empty($kwhValues)) {
            return [];
        }
        $totalEnergyChargeRows = [];
        $energyCharges = $computed['energy_charges'];
        $energyChargeRates = $computed['energy_charge_rates'];
        foreach ($energyCharges['result'] as $index => $zoneData) {
            $zoneId = $zoneData['zoneId'] ?? $index;
            $totalEnergyChargeRows[] = [
                'label' => $this->getZoneLabel($index, 'Energy Charge'),
                'zone' => $zoneId,
                'units' => $kwhValues[$index]['value'],
                'rate' => $energyChargeRates['result'][$index],
                'amount' => $zoneData['result'],
            ];
        }

        return [
            'title' => 'Total Energy Charge',
            'rows' => $totalEnergyChargeRows,
        ];
    }

    public function getAverageAndTotalKva(?array $filteredkVAs): ?array
    {
        if (empty($filteredkVAs)) {
            return [];
        }
        $totalKva = array_sum(array_column($filteredkVAs, 'difference'));
        if (count($filteredkVAs) == 0) {
            return [
                'totalKva' => 0,
                'averageKva' => 0,
            ];
        }
        $averageKva = $totalKva / count($filteredkVAs);

        return [
            'totalKva' => $totalKva,
            'averageKva' => $averageKva,
        ];
    }

    public function getAverageAndTotalKwh(?array $filteredkWhs): ?array
    {
        if (empty($filteredkWhs)) {
            return [];
        }
        $totalKwh = array_sum(array_column($filteredkWhs, 'difference'));
        if (count($filteredkWhs) == 0) {
            return [
                'totalKwh' => 0,
                'averageKwh' => 0,
            ];
        }
        $averageKwh = $totalKwh / count($filteredkWhs);

        return [
            'totalKwh' => $totalKwh,
            'averageKwh' => $averageKwh,
        ];
    }

    public function calculateDemand(?array $kvaReadings, float $contractDemand): ?array
    {
        if (empty($kvaReadings)) {
            return [];
        }
        // Filter timezone readings
        $timezoneReadings = array_filter(
            $kvaReadings,
            fn($r) => ! empty($r['timezone_code'])
        );

        $threshold = $contractDemand * 0.75;

        if (! empty($timezoneReadings)) {

            // Priority order
            $orderedZones = ['Peak', 'Normal', 'OffPeak'];

            // Build timezone => value map
            $zoneMap = [];
            foreach ($timezoneReadings as $r) {
                $zoneMap[$r['timezone']] = $r['value'];
            }

            // Find max value
            $maxValue = max($zoneMap);

            if ($maxValue > $threshold) {

                // Pick ONLY ONE zone based on priority
                $selectedZone = null;
                foreach ($orderedZones as $zone) {
                    if (($zoneMap[$zone] ?? 0) === $maxValue) {
                        $selectedZone = $zone;
                        break;
                    }
                }

                // Build result: selected zone = value, others = 0
                $result = [];
                foreach ($orderedZones as $zone) {
                    $result[] = [
                        'timezone' => $zone,
                        'value' => ($zone === $selectedZone) ? $maxValue : 0,
                    ];
                }

                return [
                    'is_contract_demand' => false,
                    'result' => $result,
                ];
            }
        }

        // Fallback → contract demand
        return [
            'is_contract_demand' => true,
            'result' => [
                'timezone' => null,
                'value' => $threshold,
            ],
        ];
    }

    private function toSnakeCase(string $value): string
    {


        return strtolower(
            preg_replace('/[^a-z0-9]+/i', '_', trim($value))
        );
    }

    private function getZoneLabel(int $index, string $base): string
    {
        return match ($index) {
            0 => "{$base} - Normal",
            1 => "{$base} - Peak",
            2 => "{$base} - Off Peak",
            default => "{$base} - Zone {$index}",
        };
    }
}
