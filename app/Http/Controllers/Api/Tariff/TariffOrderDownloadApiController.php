<?php

namespace App\Http\Controllers\Api\Tariff;

use App\Http\Controllers\Controller;
use App\Services\Tariff\TariffOrderService;

class TariffOrderDownloadApiController extends Controller
{
    public function __construct(
        private TariffOrderService $tariffOrderService
    ) {}

    public function __invoke(int $id)
    {
        $file = $this->tariffOrderService->downloadTariffOrder($id);

        if (! $file->data) {
            abort(404, 'File not found');
        }

        return response($file->data['contents'])
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="'.$file->data['file_name'].'"')
            ->header('Content-Length', strlen($file->data['contents']));
    }
}
