<?php

namespace App\Http\Controllers\Offices;

use App\Http\Controllers\Controller;
use App\Http\Requests\Consumers\OfficeFormRequest;
use App\Http\Requests\Offices\OfficeHierarchyForm;
use App\Services\Consumers\OfficeService;
use App\Services\Offices\OfficeHierarchyRelService;
use App\Services\Parameters\ParameterValueService;

class OfficesCreateWithCsvController extends Controller
{
    public function __construct(
        private OfficeService $officeService,
        private ParameterValueService $parameterValueService,
        private OfficeHierarchyRelService $officeHierarchyRelService,
    ) {}

    public function __invoke()
    {
        $delimiter = ';'; // adjust if CSV is comma-separated

        /**
         * Step 1: Load Region CSV and build lookup (id → office_code)
         */
        $regionPath = base_path('app/seed/region.csv');
        if (($handle = fopen($regionPath, 'r')) === false) {
            throw new \RuntimeException("Cannot open file: $regionPath");
        }
        $regionHeaders = fgetcsv($handle, 0, $delimiter);

        $regions = [];
        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $record = array_combine($regionHeaders, $row);
            $regions[$record['id']] = $record['code']; // map id → office_code
        }
        fclose($handle);

        /**
         * Step 2: Get office_type_ids
         */
        $officeTypeResponse = $this->parameterValueService->getParameterValues(
            1,
            10,
            null,
            'Organization-Distribution',
            'Office Type'
        );

        $regionOfficeTypeId = 0;
        $circleOfficeTypeId = 0;
        foreach ($officeTypeResponse->data as $officeType) {
            if ($officeType['parameter_value'] === 'Region') {
                $regionOfficeTypeId = $officeType['id'];
            }
            if ($officeType['parameter_value'] === 'Circle') {
                $circleOfficeTypeId = $officeType['id'];
            }
        }

        /**
         * Step 3: Create Region Offices
         */
        $handle = fopen($regionPath, 'r');
        fgetcsv($handle, 0, $delimiter); // skip header
        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $record = array_combine($regionHeaders, $row);

            $officeRequest = OfficeFormRequest::from([
                'office_name' => $record['office_name'],
                'office_code' => (int) $record['code'],
                'office_description' => $record['office_name'],
                'office_type_id' => $regionOfficeTypeId,
                'parent_offices' => null,
            ]);

            $response = $this->officeService->createOffice($officeRequest);

        }
        fclose($handle);

        /**
         * Step 4: Create Circle Offices + Hierarchies
         */
        $circlePath = base_path('app/seed/circle.csv');
        if (($handle = fopen($circlePath, 'r')) === false) {
            throw new \RuntimeException("Cannot open file: $circlePath");
        }
        $circleHeaders = fgetcsv($handle, 0, $delimiter);

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $record = array_combine($circleHeaders, $row);

            $officeRequest = OfficeFormRequest::from([
                'office_name' => $record['office_name'],
                'office_code' => (int) $record['code'],
                'office_description' => $record['office_name'],
                'office_type_id' => $circleOfficeTypeId,
                'parent_offices' => null,
            ]);

            $response = $this->officeService->createOffice($officeRequest);
            if ($response->hasError()) {
                return $response->error;
            }

            // Lookup parent office_code using region_id → code
            $regionId = $record['region_id'];
            $parentOfficeCode = $regions[$regionId] ?? null;

            if ($parentOfficeCode) {
                $officeHierarchyRequest = OfficeHierarchyForm::from([
                    'office_code' => (int) $record['code'],
                    'hierarchy_code' => 'ORGANISATION_DISTRIBUTION',
                    'parent_office_code' => (int) $parentOfficeCode,
                ]);

                $response = $this->officeHierarchyRelService->createOfficeHierarchyRel($officeHierarchyRequest);
                if ($response->hasError()) {
                    return $response->error;
                }
            }
        }
        fclose($handle);

        return response()->json(['message' => 'Offices created successfully']);
    }
}
