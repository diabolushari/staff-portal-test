<?php

namespace App\Services\Metering;

use App\Http\Requests\MeterProfileParameter\MeterProfileParameterFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\MeteringProfile\DeleteMeteringProfileParameterRequest;
use Proto\MeteringProfile\GetMeteringProfileParameterRequest;
use Proto\MeteringProfile\ListMeteringProfileParametersPaginatedRequest;
use Proto\MeteringProfile\ListMeteringProfileParametersRequest;
use Proto\MeteringProfile\MeteringProfileParameterFormRequest;
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

       public function listPaginatedMeteringProfileParameters(
        int $pageNumber = 1,
        int $pageSize = 10,
        ?string $sortBy = null,
        ?string $sortDirection = null,
        ?string $search = null,
    ): GrpcServiceResponse {
        $request = new ListMeteringProfileParametersPaginatedRequest();
        $request->setPageNumber($pageNumber);
        $request->setPageSize($pageSize);
        
        if ($sortBy !== null) {
            $request->setSortBy($sortBy);
        }
        
        if ($search !== null) {
            $request->setSearch($search);
        }
        
        
       
        [$response, $status] = $this->client->ListMeteringProfileParametersPaginated($request)->wait();
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
            $meteringParameterProfilesArray[] = self::toArray($detail);
        }
        $meteringParameterProfilesData = [
            'metering_parameter_profiles' => $meteringParameterProfilesArray,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success($meteringParameterProfilesData, $response, $status->code, $status->details);
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

    public function createMeterProfileParameter(MeterProfileParameterFormRequest $meterProfileParameterFormRequest): GrpcServiceResponse
    {
        $request = new MeteringProfileParameterFormRequest();


        $request->setProfileId($meterProfileParameterFormRequest->profileId);
        $request->setName($meterProfileParameterFormRequest->name);
        $request->setDisplayName($meterProfileParameterFormRequest->displayName);
        $request->setIsExport($meterProfileParameterFormRequest->isExport);
        $request->setIsCumulative($meterProfileParameterFormRequest->isCumulative);


        [$response, $status] = $this->client->CreateMeteringProfileParameter($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }



        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }

    public function getMeterProfileParameter(int $id): GrpcServiceResponse
    {
        $request = new GetMeteringProfileParameterRequest();
        $request->setId($id);

        [$response, $status] = $this->client->GetMeteringProfileParameter($request)->wait();


        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(self::toArray($response->getProfile()), $response, $status->code, $status->details);
    }

    public function updateMeterProfileParameter(MeterProfileParameterFormRequest $meterProfileParameterFormRequest, int $id): GrpcServiceResponse
    {
        $request = new MeteringProfileParameterFormRequest();


        $request->setProfileId($meterProfileParameterFormRequest->profileId);
        $request->setName($meterProfileParameterFormRequest->name);
        $request->setDisplayName($meterProfileParameterFormRequest->displayName);
        $request->setIsExport($meterProfileParameterFormRequest->isExport);
        $request->setIsCumulative($meterProfileParameterFormRequest->isCumulative);
        $request->setMeterParameterId($id);



        [$response, $status] = $this->client->UpdateMeteringProfileParameter($request)->wait();


        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }



        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }

    public function deleteMeterProfileParameter(int $id): GrpcServiceResponse
    {
        $request = new DeleteMeteringProfileParameterRequest();
        $request->setId($id);

        [$response, $status] = $this->client->DeleteMeteringProfileParameter($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
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
