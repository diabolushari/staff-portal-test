<?php

namespace App\Services\Metering;

use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Metering\ListMeteringParameterProfilesRequest;
use Proto\Metering\MeteringParameterProfileMessage;
use Proto\Metering\MeteringParameterProfileServiceClient;

class MeteringParameterProfileService
{
    private MeteringParameterProfileServiceClient $client;

    public function __construct(
        private ParameterValueService $parameterValueService
    ) {
        $this->client = new MeteringParameterProfileServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listMeteringParameterProfiles($page = 1, $pageSize = 10, $search = null, $profileId = null)
    {
        $protoRequest = new ListMeteringParameterProfilesRequest;
        if ($page) {
            $protoRequest->setPage($page);
        }
        if ($pageSize) {
            $protoRequest->setPageSize($pageSize);
        }
        if ($search) {
            $protoRequest->setSearch($search);
        }
        if ($profileId) {
            $protoRequest->setProfileId($profileId);
        }
        [$response, $status] = $this->client->listMeteringParameterProfiles($protoRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $meteringParameterProfilesArray = [];
        foreach ($response->getProfiles() as $detail) {
            $detail = $this->toArray($detail);
            $meteringParameterProfilesArray[] = $detail;
        }

        return GrpcServiceResponse::success($meteringParameterProfilesArray, $response, $status->code, $status->details);
    }

    public function toArray(?MeteringParameterProfileMessage $detail): ?array
    {
        if ($detail === null) {
            return null;
        }

        return [
            'id' => $detail->getProfileId(),
            'meter_parameter_id' => $detail->getMeterParameterId(),
            'name' => $detail->getName(),
            'display_name' => $detail->getDisplayName(),
            'profile_id' => $detail->getProfileId(),
            'created_by' => $detail->getCreatedBy(),
            'updated_by' => $detail->getUpdatedBy(),
            'is_active' => $detail->getIsActive(),
            'profile' => $this->parameterValueService->toArray($detail->getProfile()),
        ];
    }
}
