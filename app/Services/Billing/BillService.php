<?php

namespace App\Services\Billing;

use App\GrpcConverters\Billing\BillProtoConverter;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Proto\Bill\BillServiceClient;
use Grpc\ChannelCredentials;
use Proto\Bill\ListBillRequest;

class BillService
{
    private BillServiceClient $client;
    public function __construct(
    ) {

        $this->client = new BillServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listBills():GrpcServiceResponse
    {
        $proto = new ListBillRequest();
        
        [$response, $status] = $this->client->listBill($proto)->wait();

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
            $bill = BillProtoConverter::convertToProto($bill);
            $billsArray[] = $bill;
        }

        return GrpcServiceResponse::success($billsArray, $response, $status->code, $status->details);
    }
}