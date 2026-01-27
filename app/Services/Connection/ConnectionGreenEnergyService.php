<?php

namespace App\Services\Connection;

use App\GrpcConverters\Connection\ConnectionGreenEnergyConverter;
use App\Http\Requests\Connections\ConnectionGreenEnergyFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Consumers\CreateGreenEnergyMessage;
use Proto\Consumers\CreateGreenEnergyRequest;
use Proto\Consumers\GreenEnergyServiceClient;

class ConnectionGreenEnergyService
{
    private GreenEnergyServiceClient $client;

    public function __construct()
    {
        $this->client = new GreenEnergyServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }





    public function create(ConnectionGreenEnergyFormRequest $request): GrpcServiceResponse
    {
        $greenEnergy = ConnectionGreenEnergyConverter::formToGrpcMessage($request);

        $grpcRequest = new CreateGreenEnergyRequest();
        $grpcRequest->setGreenEnergy([$greenEnergy]);

        [$response, $status] =
            $this->client->CreateGreenEnergy($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            ConnectionGreenEnergyConverter::convertToArray($response->getGreenEnergy()),
            $response,
            $status->code,
            $status->details
        );
    }
}
