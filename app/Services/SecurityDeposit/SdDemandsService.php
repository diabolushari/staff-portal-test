<?php

namespace App\Services\SecurityDeposit;

use App\GrpcConverters\SecurityDeposit\SdDemandConverter;
use App\Http\Requests\SecurityDeposit\SdDemandFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Proto\Consumers\CreateSdDemandRequest;
use Proto\Consumers\GetSdDemandRequest;
use Proto\Consumers\SdDemandServiceClient;
use Grpc\ChannelCredentials;

class SdDemandsService
{
    private SdDemandServiceClient $client;

    public function __construct(private readonly SdDemandConverter $sdDemandService)
    {
        $this->client = new SdDemandServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function create(SdDemandFormRequest $request): GrpcServiceResponse
    {
        $sdDemand = $this->sdDemandService->formToGrpcMessage($request);

        $grpcRequest = new CreateSdDemandRequest();
        $grpcRequest->setSdDemand($sdDemand);

        [$response, $status] =
            $this->client->CreateSdDemand($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $sdDemandArray = $this->sdDemandService->convertToArray($response->getSdDemand());


        return GrpcServiceResponse::success(
            $sdDemandArray,
            $response,
            $status->code,
            $status->details
        );
    }

    public function getSdDemand(int $id)
    {

        $request = new GetSdDemandRequest();
        $request->setSdDemandId($id);
        [$response, $status] = $this->client->GetSdDemand($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $sdDemand = $response->getSdDemand();
        $sdDemandArray = $this->sdDemandService->convertToArray($sdDemand);

        return GrpcServiceResponse::success($sdDemandArray, $response, $status->code, $status->details);
    }
}
