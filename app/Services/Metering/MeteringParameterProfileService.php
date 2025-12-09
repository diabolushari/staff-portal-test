<?php

namespace App\Services\Metering;

use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\MeteringProfile\ListMeteringProfileParametersRequest;
use Proto\MeteringProfile\MeteringProfileParameterMessage;
use Proto\MeteringProfile\MeteringProfileParameterServiceClient;

class MeteringParameterProfileService
{
    private MeteringProfileParameterServiceClient $client;

    public function __construct(
        private ParameterValueService $parameterValueService
    ) {
        $this->client = new MeteringProfileParameterServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listMeteringProfileParameters(int $page = 1, int $pageSize = 10, ?string $search = null, ?int $profileId = null): GrpcServiceResponse
    {
        $protoRequest = new ListMeteringProfileParametersRequest;
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
        [$response, $status] = $this->client->ListMeteringProfileParameters($protoRequest)->wait();
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

    /**
     * @return array<string, mixed>
     */
    public function toArray(?MeteringProfileParameterMessage $detail): ?array
    {
        if ($detail === null) {
            return null;
        }

        return [
            'id' => $detail->getProfileId(),
            'meter_parameter_id' => $detail->getMeterParameterId(),
            'name' => $detail->getName(),
            'display_name' => $detail->getDisplayName(),
            'is_export' => $detail->getIsExport(),
            'profile_id' => $detail->getProfileId(),
            'created_by' => $detail->getCreatedBy(),
            'updated_by' => $detail->getUpdatedBy(),
            'is_active' => $detail->getIsActive(),
            'is_cumulative' => $detail->getIsCumulative(),
            'profile' => $this->parameterValueService->toArray($detail->getProfile()),
        ];
    }
}
