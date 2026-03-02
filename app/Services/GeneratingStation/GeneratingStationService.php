<?php

namespace App\Services\GeneratingStation;

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
            $stations[] = [
                'station_id' => $station->getStationId(),
                'station_name' => $station->getStationName(),
                'installed_capacity' => $station->getInstalledCapacity(),
                'commissioning_date' => $station->getCommissioningDate(),
                'generation_type' => $station->getGenerationType()
                    ? [
                        'parameter_value' =>
                            $station->getGenerationType()->getParameterValue()
                    ]
                    : null,

                'plant_type' => $station->getPlantType()
                    ? [
                        'parameter_value' =>
                            $station->getPlantType()->getParameterValue()
                    ]
                    : null,

                'voltage_category' => $station->getVoltageCategory()
                    ? [
                        'parameter_value' =>
                            $station->getVoltageCategory()->getParameterValue()
                    ]
                    : null,

                'generation_status' => $station->getGenerationStatus()
                    ? [
                        'parameter_value' =>
                            $station->getGenerationStatus()->getParameterValue()
                    ]
                    : null,
            ];
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

  public function getGeneratingStation($id)
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
        if (!$station) {
            return GrpcServiceResponse::success(null);
        }
        $attributes = [];
        foreach ($station->getAttributes() as $attr) {
            $attrDef = $attr->getAttributeDefinition();
            $attrValueObj = $attr->getAttributeValueObject();

            $attributes[] = [
                'attribute_definition_id' => $attr->getAttributeDefinitionId(),
                'attribute_value' => $attr->getAttributeValue(),

                'attribute_value_object' => $attrValueObj ? [
                    'id' => $attrValueObj->getId(),
                    'parameter_value' => $attrValueObj->getParameterValue(),
                ] : null,

                'attribute_definition' => $attrDef ? [
                    'id' => $attrDef->getId(),
                    'parameter_value' => $attrDef->getParameterValue(),
                    'attribute1_value' => $attrDef->getAttribute1Value(),
                    'attribute2_value' => $attrDef->getAttribute2Value(),
                    'attribute3_value' => $attrDef->getAttribute3Value(),
                    'attribute4_value' => $attrDef->getAttribute4Value(),
                    'attribute5_value' => $attrDef->getAttribute5Value(),
                ] : null,
            ];
        }

        return GrpcServiceResponse::success([
            'station_id' => $station->getStationId(),
            'station_name' => $station->getStationName(),
            'installed_capacity' => $station->getInstalledCapacity(),
            'commissioning_date' => $station->getCommissioningDate(),
            'is_active' => $station->getIsActive(),
            'generation_type' => $station->getGenerationType()
                ? ['parameter_value' => $station->getGenerationType()->getParameterValue()]
                : null,
            'plant_type' => $station->getPlantType()
                ? ['parameter_value' => $station->getPlantType()->getParameterValue()]
                : null,
            'voltage_category' => $station->getVoltageCategory()
                ? ['parameter_value' => $station->getVoltageCategory()->getParameterValue()]
                : null,
            'generation_status' => $station->getGenerationStatus()
                ? ['parameter_value' => $station->getGenerationStatus()->getParameterValue()]
                : null,
            'attributes' => $attributes,
            'address' => $station->getAddress()
                ? [
                    'address_line_1' => $station->getAddress()->getAddressLine1(),
                    'address_line_2' => $station->getAddress()->getAddressLine2(),
                    'city_town_village' => $station->getAddress()->getCityTownVillage(),
                    'pincode' => $station->getAddress()->getPincode(),
                     'district' => $station->getAddress()->getDistrict()
                    ? [
                        'name' => $station->getAddress()->getDistrict()->getRegionName()
                    ]
                    : null,
                ]
                : null,
        ]);
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