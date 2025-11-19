<?php

namespace App\Http\Controllers\Offices;

use App\Http\Controllers\Controller;
use App\Services\Consumers\OfficeService;
use Inertia\Inertia;
use Inertia\Response;

class OfficeBillingController extends Controller
{
    public function __construct(
        private OfficeService $officeService
    ) {}

    public function __invoke(int $officeCode): Response
    {
        $office = $this->officeService->getOffice(null, $officeCode);

        return Inertia::render('Offices/OfficeBillingIndex', [
            'office' => $office->data,
        ]);
    }
}
