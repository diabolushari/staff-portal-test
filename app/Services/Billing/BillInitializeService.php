<?php

namespace App\Services\Billing;

use App\Http\Requests\Billing\BillInitializeFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Billing\BillInitializeRequest;
use Proto\Billing\BillInitializeServiceClient;

class BillInitializeService
{
    private BillInitializeServiceClient $client;

    public function __construct(
    ) {
        $this->client = new BillInitializeServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function initializeBill(BillInitializeFormRequest $request): GrpcServiceResponse
    {
        $proto = new BillInitializeRequest;
        $proto->setConnectionIds($request->connectionIds);
        $billMonth = DateTimeConverter::convertStringToTimestamp($request->billMonthYear);
        if ($billMonth != null) {
            $proto->setBillMonthYear($billMonth);
        }
        $readingMonth = DateTimeConverter::convertStringToTimestamp($request->readingMonthYear);
        if ($readingMonth != null) {
            $proto->setReadingMonthYear($readingMonth);
        }
        [$response, $status] = $this->client->InitializeBill($proto)->wait();

        $json = $response->getBill()->serializeToJsonString(); // correct method
        dd(json_decode($json, true));
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success([], $response, $status->code, $status->details);
    }
}
