<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Consumers\OfficeService;
use App\Services\Parameters\ParameterValueService;
use Illuminate\Http\Request;
use Proto\Consumers\OfficeListRequest;

class OfficeListApiController extends Controller
{
    public function __construct(private OfficeService $officeService, private ParameterValueService $parameterValueService) {}

    public function __invoke(Request $request)
    {
        $sortPriority = $request->query('sortPriority') - 1;

        $officeType = null;

        if ($sortPriority !== null) {
            $parameterValues = $this->parameterValueService->getParameterValues(
                1,
                100,
                null,
                null,
                'Distribution Office Type'
            )?->data ?? [];

            $officeType = collect($parameterValues)
                ->first(function ($parameterValue) use ($sortPriority) {
                    return ($parameterValue['sort_priority'] ?? 0) == $sortPriority;
                });
        }
        // Now $officeType is a single array (or null if not found)
        $officeTypeValue = $officeType['parameter_value'] ?? null;
        $query = $request->query('q');
        $offices = $this->officeService->getOffices(1, 10, null, $officeTypeValue, $query)->data;
        $officeArray = [];
        foreach ($offices as $office) {
            $officeArray[] = [
                'office_id' => $office['office_id'],
                'office_name' => $office['office_name'],
            ];
        }

        return response()->json($officeArray);
    }
}
