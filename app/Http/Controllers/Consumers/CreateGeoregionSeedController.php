<?php

namespace App\Http\Controllers\Consumers;

use App\Http\Controllers\Controller;
use App\Services\Consumers\GeoRegionsService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class CreateGeoregionSeedController extends Controller
{
    public function __construct(
        private readonly GeoRegionsService $geoRegionsService,
        private readonly ParameterValueService $parameterValueService,
    ) {}

    public function __invoke(): Response|RedirectResponse
    {
        $path = base_path('app/seed/kerala_regions.csv');

        if (($handle = fopen($path, 'r')) === false) {
            throw new \RuntimeException("Cannot open file: $path");
        }

        $headers = fgetcsv($handle, 0, ','); // read headers with comma delimiter
        $rows = [];
        while (($row = fgetcsv($handle, 0, ',')) !== false) {
            $rows[] = array_combine($headers, $row);
        }

        fclose($handle);
        $geoRegionTypes = [];
        foreach ($rows as $row) {
            $geoRegionType = $this->parameterValueService->getParameterValues(
                1,
                10,
                $row['type'],
                'Regions',
                'Region Type'
            );
            $geoRegionTypes[] = $geoRegionType->data;
        }
        dd($geoRegionTypes);
    }
}
