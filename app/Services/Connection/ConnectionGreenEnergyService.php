<?php

namespace App\Services\Connection;

use App\GrpcConverters\Connection\ConnectionGreenEnergyConverter;
use App\Http\Requests\Connections\ConnectionGreenEnergyFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Illuminate\Support\Facades\Log;
use Proto\GreenEnergy\CreateGreenEnergyRequest;
use Proto\GreenEnergy\GreenEnergyServiceClient;

class ConnectionGreenEnergyService
{
    private GreenEnergyServiceClient $client;

    public function __construct(private readonly ConnectionGreenEnergyConverter $connectionGreenEnergyService,)
    {
        $this->client = new GreenEnergyServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }





    public function create(ConnectionGreenEnergyFormRequest $request): GrpcServiceResponse
    {
        $greenEnergy = $this->connectionGreenEnergyService->formToGrpcMessage($request);

        $grpcRequest = new CreateGreenEnergyRequest();
        $grpcRequest->setGreenEnergy([$greenEnergy]);
        Log::info('Reached service file');
        [$response, $status] =
            $this->client->CreateGreenEnergy($grpcRequest)->wait();
        dd($response, $status);

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            $this->connectionGreenEnergyService->convertToArray($response->getGreenEnergy()),
            $response,
            $status->code,
            $status->details
        );
    }
}
