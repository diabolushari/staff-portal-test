<?php

namespace App\Services\SecurityDeposit;

use App\Http\Requests\SecurityDeposit\SdCollectionFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\SecurityDeposit\CreateSdCollectionRequest;
use Proto\SecurityDeposit\SdAttributeRequest;
use Proto\SecurityDeposit\SdCollectionMessage;
use Proto\SecurityDeposit\SdCollectionServiceClient;

class SdCollectionService
{
    private SdCollectionServiceClient $client;

    public function __construct(private SdAttributeService $sdAttributeService)
    {
        $this->client = new SdCollectionServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );

    }

    public function create(SdCollectionFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = new CreateSdCollectionRequest;

        $grpcRequest->setSdCollection(
            $this->toSdCollection($request)
        );

        if ($request->attributeData) {

            $processedAttributes = $this->sdAttributeService->processSdAttribute($request);

            $protoAttributes = [];

            foreach ($processedAttributes as $attr) {

                $attributeProto = new SdAttributeRequest;
                $attributeProto->setAttributeDefinitionId($attr['attribute_definition_id']);
                $attributeProto->setAttributeValue($attr['attribute_value']);

                if (! empty($attr['mime_type'])) {
                    $attributeProto->setMimeType($attr['mime_type']);
                }

                $protoAttributes[] = $attributeProto;
            }

            $grpcRequest->setSdAttribute($protoAttributes);
        }

        [$response, $status] = $this->client->createSdCollection($grpcRequest)->wait();

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

    private function toSdCollection(SdCollectionFormRequest $request): SdCollectionMessage
    {
        $msg = new SdCollectionMessage;

        $msg->setSdDemandId($request->sdDemandId);
        $msg->setCollectionDate($request->collectionDate);
        $msg->setCollectionModeId($request->collectionModeId);
        $msg->setCollectionAmount($request->collectionAmount);

        if ($request->receiptNumber) {
            $msg->setReceiptNumber($request->receiptNumber);
        }

        if ($request->collectedBy) {
            $msg->setCollectedBy($request->collectedBy);
        }

        if ($request->reversalReason) {
            $msg->setReversalReason($request->reversalReason);
        }

        return $msg;
    }
}
