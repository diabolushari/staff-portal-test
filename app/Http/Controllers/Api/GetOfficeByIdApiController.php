<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\Consumers\OfficeService;


class GetOfficeByIdApiController extends Controller
{
    public function __construct(private OfficeService $officeService) {}
    public function __invoke(Request $request, int $officeId): JsonResponse
    {
        if ($officeId !== 0) {
            $office = $this->officeService->getOffice($officeId);
            return response()->json($office);
        }
        return response()->json(null);
    }
}
