<?php

namespace App\Services\Billing;

use App\GrpcConverters\Billing\BillProtoConverter;
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

    public function __construct()
    {
        $this->client = new BillInitializeServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function initializeBill(BillInitializeFormRequest $request): GrpcServiceResponse
    {
        $proto = new BillInitializeRequest;
        $proto->setConnectionIds($request->connectionIds);
        $billMonth = DateTimeConverter::convertStringToTimestamp($request->billMonthYear . '-01 12:00:00');
        if ($billMonth != null) {
            $proto->setBillMonthYear($billMonth);
        }
        $readingMonth = DateTimeConverter::convertStringToTimestamp($request->readingMonthYear . '-01 12:00:00');
        if ($readingMonth != null) {
            $proto->setReadingMonthYear($readingMonth);
        }

        if ($request->billDate != null) {
            $proto->setBillDate($request->billDate);
        }
        $proto->setBillingGroupId($request->billingGroupId);
        [$response, $status] = $this->client->InitializeBill($proto)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $bills = $response->getBills();
        $billsArray = [];
        foreach ($bills as $bill) {
            $billsArray[] = BillProtoConverter::convertToBill($bill);
        }

        return GrpcServiceResponse::success($billsArray, $response, $status->code, $status->details);
    }
}
