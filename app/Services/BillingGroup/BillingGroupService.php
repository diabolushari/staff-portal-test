<?php

namespace App\Services\BillingGroup;

use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use App\GrpcConverters\BillingGroup\BillingGroupProtoConvertor;
use Proto\BillingGroup\BillingGroupMessage;
use App\Http\Requests\BillingGroup\BillingGroupFormRequest;
use Proto\BillingGroup\BillingGroupServiceClient;
use Proto\BillingGroup\CreateBillingGroupRequest;
use Proto\BillingGroup\UpdateBillingGroupRequest;
use Proto\BillingGroup\GetBillingGroupRequest;
use Proto\BillingGroup\DeleteBillingGroupRequest;
use Proto\BillingGroup\ListBillingGroupRequest;

class BillingGroupService
{
    private BillingGroupServiceClient $client;

    public function __construct()
    {
        $this->client = new BillingGroupServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }


    public function createBillingGroup(BillingGroupFormRequest $request): GrpcServiceResponse
    {
        $req = new CreateBillingGroupRequest;

        $req->setName($request->name);
        if (!empty($request->description)) {
            $req->setDescription($request->description);
        }


        $req->setIsActive(true);

        [$response, $status] = $this->client->CreateBillingGroup($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details,
            );
        }

        return GrpcServiceResponse::success(
            BillingGroupProtoConvertor::convertToArray($response->getGroup()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function updateBillingGroup(array $input): GrpcServiceResponse
    {
        $req = new UpdateBillingGroupRequest;

        $req->setVersionId($input['version_id']);
        $req->setBillingGroupId($input['billing_group_id']);
        $req->setName($input['name']);

        if (!empty($input['description'])) {
            $req->setDescription($input['description']);
        }

        if (!empty($input['effective_start'])) {
            $ts = new Timestamp();
            $ts->fromDateTime(new \DateTime($input['effective_start']));
            $req->setEffectiveStart($ts);
        }

        if (!empty($input['effective_end'])) {
            $ts = new Timestamp();
            $ts->fromDateTime(new \DateTime($input['effective_end']));
            $req->setEffectiveEnd($ts);
        }

        $req->setIsActive($input['is_active']);
        $req->setUpdatedBy($input['updated_by']);



        [$response, $status] = $this->client->UpdateBillingGroup($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            BillingGroupProtoConvertor::convertToArray($response->getGroup()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function getBillingGroup(int $versionId, ?int $billingGroupId = null): GrpcServiceResponse
    {
        $req = new GetBillingGroupRequest;
        $req->setVersionId($versionId);

        if ($billingGroupId !== null) {
            $req->setBillingGroupId($billingGroupId);
        }

        [$response, $status] = $this->client->GetBillingGroup($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            BillingGroupProtoConvertor::convertToArray($response->getGroup()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function deleteBillingGroup(int $versionId, int $deletedBy): GrpcServiceResponse
    {
        $req = new DeleteBillingGroupRequest;
        $req->setVersionId($versionId);
        $req->setDeletedBy($deletedBy);

        [$response, $status] = $this->client->DeleteBillingGroup($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            ['success' => $response->getSuccess(), 'message' => $response->getMessage()],
            $response,
            $status->code,
            $status->details
        );
    }

    public function listBillingGroups(): GrpcServiceResponse
    {
        $req = new ListBillingGroupRequest;


        [$response, $status] = $this->client->ListBillingGroup($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $groups = [];
        foreach ($response->getGroups() as $group) {
            $groups[] = BillingGroupProtoConvertor::convertToArray($group);
        }

        return GrpcServiceResponse::success($groups, $response, $status->code, $status->details);
    }
}
