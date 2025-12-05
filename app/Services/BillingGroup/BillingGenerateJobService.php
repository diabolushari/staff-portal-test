<?php

namespace App\Services\BillingGroup;

use App\GrpcConverters\BillingGroup\BillingGroupProtoConvertor;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Proto\Bill\BillGenerationJobStatusMessage;
use Proto\Bill\BillGenerationJobStatusServiceClient;
use Proto\Bill\ListBillGenerationJobStatusRequest;
use Grpc\ChannelCredentials;

class BillingGenerateJobService
{
    private BillGenerationJobStatusServiceClient $client;

    public function __construct()
    {
        $this->client = new BillGenerationJobStatusServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listBillGenerationJobStatus(
        ?int $billingGroupId,
        ?string $readingYearMonth
    ): GrpcServiceResponse
    {
        $request = new ListBillGenerationJobStatusRequest();
        if ($billingGroupId) {
            $request->setBillingGroupId($billingGroupId);
        }
        if ($readingYearMonth) {
            $request->setReadingYearMonth($readingYearMonth);
        }
        [$response, $status] = $this->client->listBillGenerationJobStatus($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $data = [];
        foreach ($response->getData() as $message) {
            $data[] = $this->BillGenerateMessageToArray($message);
        }

        return GrpcServiceResponse::success(
            $data,
            $response,
            $status->code,
            $status->details
        );
    }

    public function BillGenerateMessageToArray(BillGenerationJobStatusMessage $message): array
    {
        $billingGroup = $message->getBillingGroup();
        if ($billingGroup) {
            $billingGroup = BillingGroupProtoConvertor::convertToArray($billingGroup);
        }
        return [
            'billing_group' => $billingGroup,
            'total_connections' => $message->getTotalConnections(),
            'total_bills' => $message->getTotalBills(),
            'reading_year_month' => $message->getReadingYearMonth(),
            'bill_year_month' => $message->getBillYearMonth(),
        ];
    }

    
}
