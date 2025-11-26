<?php

namespace App\Services\Connection;

use App\Http\Requests\Connections\ConnectionPartiesMappingFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Proto\Consumers\CreatePartiesConnectionRelRequest;
use Proto\Consumers\PartiesConnectionRelServiceClient;

class ConnectionPartiesMappingService
{
    private PartiesConnectionRelServiceClient $client;

    public function __construct(
    ) {
        $this->client = new PartiesConnectionRelServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createConnectionPartiesMapping(ConnectionPartiesMappingFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = new CreatePartiesConnectionRelRequest;
        $grpcRequest->setPartyId($request->partyId);
        $grpcRequest->setConnectionId($request->connectionId);
        $grpcRequest->setEffectiveStart(DateTimeConverter::convertStringToTimestamp($request->effectiveStart));
        $grpcRequest->setIsActive(true);
        $user = FacadesAuth::user();
        if ($user) {
            $grpcRequest->setCreatedBy($user->id);
        }
        if ($request->effectiveEnd) {
            $grpcRequest->setEffectiveEnd($request->effectiveEnd);
        }
        [$response, $status] = $this->client->CreatePartiesConnectionRel($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            [],
            $response,
            $status->code,
            $status->details
        );
    }
}
