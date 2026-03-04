<?php

namespace App\Services\SecurityDeposit;

use App\GrpcConverters\SecurityDeposit\SdRegisterConverter;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Consumers\ListSdRegistersPaginatedRequest;
use Proto\Consumers\SdRegisterServiceClient;

class SdRegisterService
{
    private SdRegisterServiceClient $client;

    public function __construct(
        private readonly SdRegisterConverter $sdRegisterConverter,
    ) {
        $this->client = new SdRegisterServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listPaginatedSdRegisters(
        ?int $pageNumber = 1,
        ?int $pageSize = 10,
    ) {
        $request = new ListSdRegistersPaginatedRequest;

        $request->setPage($pageNumber);
        $request->setPageSize($pageSize);

        [$response, $status] = $this->client->ListSdRegistersPaginated($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $sdRegisters = $response->getItems();
        $sdRegisterArray = [];
        foreach ($sdRegisters as $sdRegister) {
            $registerData = $this->sdRegisterConverter->convertToArray($sdRegister);
            $sdRegisterArray[] = $registerData;
        }

        $paginatedData = [
            'sd_registers' => $sdRegisterArray,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($paginatedData, $response, $status->code, $status->details);
    }
}
