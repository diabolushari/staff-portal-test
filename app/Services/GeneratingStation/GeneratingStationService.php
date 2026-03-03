<?php

namespace App\Services\GeneratingStation;

use App\GrpcConverters\GeneratingStation\GeneratingStationConverter;
use App\Http\Requests\GeneratingStation\GeneratingStationFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\GeneratingStation\CreateGeneratingStationRequest;
use Proto\GeneratingStation\ListGeneratingStationPaginatedRequest;
use Proto\GeneratingStation\GetGeneratingStationRequest;
use Proto\GeneratingStation\GeneratingStationMessage;
use Proto\GeneratingStation\GeneratingStationAttributeRequest;
use Proto\Connections\AddressMessage;
use Proto\GeneratingStation\GeneratingStationServiceClient;

class GeneratingStationService
{
    private GeneratingStationServiceClient $client;

    public function __construct(
        private GeneratingStationAttributeService $attributeService
    ) {
        $this->client = new GeneratingStationServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listPaginatedGeneratingStations(
        ?int $page = 1,
        ?int $pageSize = 10,
        ?string $search = null
    ): GrpcServiceResponse {

        $req = new ListGeneratingStationPaginatedRequest();

        if ($page !== null) {
            $req->setPage($page);
        }

        if ($pageSize !== null) {
            $req->setPageSize($pageSize);
        }

        if ($search !== null) {
            $req->setStationName($search);
        }

        [$response, $status] =
            $this->client->ListGeneratingStationPaginated($req)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $stations = [];

        foreach ($response->getItems() as $station) {
            $stations[] = GeneratingStationConverter::convertToArray($station);
        }

        $data = [
            'items' => $stations,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];

        return GrpcServiceResponse::success(
            $data,
            $response,
            $status->code,
            $status->details
        );
    }

    public function create(GeneratingStationFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = new CreateGeneratingStationRequest();

        $grpcRequest->setStation(
            $this->toGeneratingStation($request)
        );

        $grpcRequest->setAddress(
            $this->toAddress($request)
        );


        if ($request->attributeData) {

            $processedAttributes = $this->attributeService
                ->processGeneratingStationAttributes($request);

            $protoAttributes = [];

            foreach ($processedAttributes as $attr) {

                $attributeProto = new GeneratingStationAttributeRequest();

                $attributeProto->setAttributeDefinitionId(
                    $attr['attribute_definition_id']
                );

                $attributeProto->setAttributeValue(
                    $attr['attribute_value']
                );

                $protoAttributes[] = $attributeProto;
            }

            $grpcRequest->setAttributes($protoAttributes);
        }

        [$response, $status] =
            $this->client->CreateGeneratingStation($grpcRequest)->wait();

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

    public function getGeneratingStation(int $id): GrpcServiceResponse
    {
        $request = new GetGeneratingStationRequest();
        $request->setStationId($id);

        [$response, $status] = $this->client->GetGeneratingStation($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $station = $response->getStation();
        return GrpcServiceResponse::success(
            GeneratingStationConverter::convertToArray($station),
            $response,
            $status->code,
            $status->details
        );
    }

    private function toGeneratingStation(
        GeneratingStationFormRequest $request
    ): GeneratingStationMessage {

        $msg = new GeneratingStationMessage();

        $msg->setConnectionId($request->connectionId);
        $msg->setStationName($request->stationName);
        $msg->setGenerationStatusId($request->generationStatusId);
        $msg->setInstalledCapacity($request->installedCapacity);

        $msg->setGenerationTypeId($request->generationTypeId);
        $msg->setVoltageCategoryId($request->voltageCategoryId);
        $msg->setPlantTypeId($request->plantTypeId);

        $msg->setCommissioningDate($request->commissioningDate);

        return $msg;
    }

    private function toAddress(
        GeneratingStationFormRequest $request
    ): AddressMessage {

        $address = new AddressMessage();

        $address->setAddressLine1($request->addressLine1);
        $address->setAddressLine2($request->addressLine2 ?? '');
        $address->setCityTownVillage($request->cityTownVillage);
        $address->setPincode($request->pincode);
        $address->setDistrictId($request->districtId);
        $address->setStateId($request->stateId);

        return $address;
    }
}
