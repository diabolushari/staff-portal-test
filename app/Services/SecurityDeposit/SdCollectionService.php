<?php
namespace App\Services\SecurityDeposit;

use App\Http\Requests\SecurityDeposit\SdCollectionFormRequest;
use App\Services\utils\GrpcServiceResponse;
use App\Services\Grpc\GrpcErrorService;
use Grpc\ChannelCredentials;
use Proto\SecurityDeposit\SdCollectionServiceClient;
use Proto\SecurityDeposit\CreateSdCollectionRequest;
use Proto\SecurityDeposit\SdCollectionMessage;
use Proto\SecurityDeposit\SdAttributeRequest;



class SdCollectionService
{
    private SdCollectionServiceClient $client;

    public function __construct()
    {
        $this->client = new SdCollectionServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function create(SdCollectionFormRequest $request): GrpcServiceResponse
{
    $grpcRequest = new CreateSdCollectionRequest();

    $grpcRequest->setSdCollection(
        $this->toSdCollection($request)
    );


   if ($request->attributeDefinitionId) {
        $grpcRequest->setSdAttribute(
            $this->toSdCollectionAttribute($request)
        );
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
        $msg = new SdCollectionMessage();

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

   private function toSdCollectionAttribute(SdCollectionFormRequest $request)
    {
       $attr = new SdAttributeRequest();

        $attr->setAttributeDefinitionId($request->attributeDefinitionId);
        $attr->setAttributeValue($request->attributeValue);
        $attr->setIsVerified($request->isVerified ?? false);

        if ($request->verifiedDate) {
            $attr->setVerifiedDate($request->verifiedDate);
        }

        if ($request->expiryDate) {
            $attr->setExpiryDate($request->expiryDate);
        }

        if ($request->documentPath instanceof UploadedFile) {
            $path = $request->documentPath->store('sd-collections');
            $attr->setDocumentPath($path);
        }

        return $attr;
    }


}
