<?php

namespace App\Services\Consumers;

use App\Http\Requests\Consumers\OfficeFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use DateTime;
use Google\Protobuf\Struct;
use Google\Protobuf\Timestamp;
use Google\Protobuf\Value;
use Proto\Consumers\OfficeServiceClient;
use Grpc\ChannelCredentials;
use Proto\Consumers\OfficeCreateRequest;
use Proto\Consumers\OfficeIdRequest;
use Proto\Consumers\OfficeListRequest;
use Proto\Consumers\OfficeUpdateRequest;

class OfficeService
{
    private $client;
    public function __construct()
    {
        $this->client = new OfficeServiceClient(
            config('app.consumer_service_grpc_host'),
            ["credentials" => ChannelCredentials::createInsecure()]
        );
    }
    public function getOffices(
        int $page = 1,
        int $pageSize = 10,
        ?string $search = null,
        ?string $officeType = null,
        ?string $officeName = null
    ): GrpcServiceResponse {
        $request = new OfficeListRequest();
        if ($search !== null) {
            $request->setSearch($search);
        }
        if ($officeType !== null) {
            $request->setOfficeType($officeType);
        }
        if ($officeName !== null) {
            $request->setOfficeName($officeName);
        }

        [$response, $status] = $this->client->ListOffices($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $officesArray = [];
        foreach ($response->getOffices() as $office) {
            $effectiveStart = $office->getEffectiveStart()
                ? $office->getEffectiveStart()->toDateTime()->format('Y-m-d')
                : null;

            $effectiveEnd = $office->getEffectiveEnd()
                ? $office->getEffectiveEnd()->toDateTime()->format('Y-m-d')
                : null;
            $officeType = $office->getOfficeType();
            $officeTypeArray = [
                'office_type_id' => $officeType->getId(),
                'parameter_code' => $officeType->getParameterCode(),
                'parameter_value' => $officeType->getParameterValue(),
            ];
            $officesArray[] = [
                'office_id' => $office->getOfficeId(),
                'office_name' => $office->getOfficeName(),
                'office_code' => $office->getOfficeCode(),
                'description' => $office->getOfficeDescription(),
                'office_type_id' => $office->getOfficeTypeId(),
                'parent_office_id' => $office->getParentOfficeId(),
                'effective_start' => $effectiveStart,
                'effective_end' => $effectiveEnd,
                'created_at' => $office->getCreatedAt(),
                'updated_at' => $office->getUpdatedAt(),
                'office_type' => $officeTypeArray,
                'is_current' => $office->getIsCurrent(),
            ];
        }
        return GrpcServiceResponse::success($officesArray, $response, $status->code, $status->details);
    }
    public function createOffice(OfficeFormRequest $request): GrpcServiceResponse
    {
        $proto = new OfficeCreateRequest();
        $proto->setOfficeName($request->officeName);
        $proto->setOfficeCode($request->officeCode);
        $proto->setOfficeDescription($request->officeDescription);
        $proto->setOfficeTypeId($request->officeTypeId);
        if ($request->parentOfficeId !== null) {
            $proto->setParentOfficeId($request->parentOfficeId);
        }
        $contactFolioStruct = new Struct();
        $fields = [];

        foreach (['phone', 'email', 'name', 'address'] as $key) {
            if (!empty($request->contactFolio[$key])) {
                $value = new Value();
                $value->setStringValue($request->contactFolio[$key]);
                $fields[$key] = $value;
            }
        }
        $contactFolioStruct->setFields($fields);
        $proto->setContactFolio($contactFolioStruct);

        if ($request->effectiveStart) {

            $effectiveStart = new Timestamp();
            $effectiveStart->fromDateTime(new DateTime($request->effectiveStart));
            $proto->setEffectiveStart($effectiveStart);
        } else {
            $effectiveStart = new Timestamp();
            $effectiveStart->fromDateTime(new DateTime(date('Y-m-d')));
            $proto->setEffectiveStart($effectiveStart);
        }
        if (!empty($request->effectiveEnd)) {
            $effectiveEnd = new Timestamp();
            $effectiveEnd->fromDateTime(new DateTime($request->effectiveEnd));
            $proto->setEffectiveEnd($effectiveEnd);
        }
        [$response, $status] = $this->client->CreateOffice($proto)->wait();
        $office = $response->getOffice();
        $officeArray = [];
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $officeArray = [
            'office_name' => $office->getOfficeName(),
            'office_code' => $office->getOfficeCode(),
            'description' => $office->getOfficeDescription(),
            'office_type_id' => $office->getOfficeTypeId(),
            'parent_office_id' => $office->getParentOfficeId(),
            'effective_start' => $office->getEffectiveStart(),
            'effective_end' => $office->getEffectiveEnd(),
            'created_at' => $office->getCreatedAt(),
            'updated_at' => $office->getUpdatedAt(),
        ];
        return GrpcServiceResponse::success($officeArray, $response, $status->code, $status->details);
    }

    public function getOffice(int $id): GrpcServiceResponse
    {
        $request = new OfficeIdRequest();
        $request->setOfficeId((int)$id);
        [$response, $status] = $this->client->GetOfficeById($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $office = $response->getOffice();
        $contactFolioStruct = $office->getContactFolio();
        $contactFolio = [];
        if ($contactFolioStruct) {
            // convert Struct -> PHP array
            $contactFolioArray = $contactFolioStruct->getFields();

            // Example: loop through
            foreach ($contactFolioArray as $key => $value) {
                $contactFolio[$key] = $value->getKind() === 'stringValue'
                    ? $value->getStringValue()
                    : $value->serializeToJsonString();
            }


            $contactFolioJsonString = $contactFolioStruct->serializeToJsonString();
            $contactFolio = json_decode($contactFolioJsonString);
        }
        $effectiveStart = $office->getEffectiveStart()
            ? $office->getEffectiveStart()->toDateTime()->format('Y-m-d')
            : null;

        $effectiveEnd = $office->getEffectiveEnd()
            ? $office->getEffectiveEnd()->toDateTime()->format('Y-m-d')
            : null;
        $officeType = $office->getOfficeType();
        $officeTypeArray = [
            'office_type_id' => $officeType->getId(),
            'parameter_code' => $officeType->getParameterCode(),
            'parameter_value' => $officeType->getParameterValue(),
        ];
        $officeArray = [
            'office_id' => $office->getOfficeId(),
            'office_name' => $office->getOfficeName(),
            'office_code' => $office->getOfficeCode(),
            'office_description' => $office->getOfficeDescription(),
            'office_type_id' => $office->getOfficeTypeId(),
            'parent_office_id' => $office->getParentOfficeId(),
            'effective_start' => $effectiveStart,
            'effective_end' => $effectiveEnd,
            'created_at' => $office->getCreatedAt(),
            'updated_at' => $office->getUpdatedAt(),
            'contact_folio' => $contactFolio,
            'office_type' => $officeTypeArray,
        ];
        return GrpcServiceResponse::success($officeArray, $response, $status->code, $status->details);
    }
    public function updateOffice(OfficeFormRequest $request, int $id): GrpcServiceResponse
    {
        $proto = new OfficeUpdateRequest();
        $proto->setOfficeId($id);
        $proto->setOfficeName($request->officeName);
        $proto->setOfficeCode($request->officeCode);
        $proto->setOfficeDescription($request->officeDescription);
        $proto->setOfficeTypeId($request->officeTypeId);
        if ($request->parentOfficeId !== null) {
            $proto->setParentOfficeId($request->parentOfficeId);
        }
        $contactFolioStruct = new Struct();
        $fields = [];

        foreach (['phone', 'email', 'name', 'address'] as $key) {
            if (!empty($request->contactFolio[$key])) {
                $value = new Value();
                $value->setStringValue($request->contactFolio[$key]);
                $fields[$key] = $value;
            }
        }
        $contactFolioStruct->setFields($fields);
        $proto->setContactFolio($contactFolioStruct);


        if (!empty($request->effectiveStart)) {
            $effectiveStart = new Timestamp();
            $effectiveStart->fromDateTime(new DateTime($request->effectiveStart));
            $proto->setEffectiveStart($effectiveStart);
        }
        if (!empty($request->effectiveEnd)) {
            $effectiveEnd = new Timestamp();
            $effectiveEnd->fromDateTime(new DateTime($request->effectiveEnd));
            $proto->setEffectiveEnd($effectiveEnd);
        }

        [$response, $status] = $this->client->UpdateOffice($proto)->wait();
        $responseOffice = $response->getOffice();
        $officeArray = [];
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $officeArray = [
            'office_name' => $responseOffice->getOfficeName(),
            'office_code' => $responseOffice->getOfficeCode(),
            'office_description' => $responseOffice->getOfficeDescription(),
            'office_type_id' => $responseOffice->getOfficeTypeId(),
            'parent_office_id' => $responseOffice->getParentOfficeId(),
            'effective_start' => $responseOffice->getEffectiveStart(),
            'effective_end' => $responseOffice->getEffectiveEnd(),
            'created_at' => $responseOffice->getCreatedAt(),
            'updated_at' => $responseOffice->getUpdatedAt(),
        ];
        return GrpcServiceResponse::success($officeArray, $response, $status->code, $status->details);
    }

    public function deleteOffice(int $id): GrpcServiceResponse
    {
        $request = new OfficeIdRequest();
        $request->setOfficeId($id);
        [$response, $status] = $this->client->DeleteOffice($request)->wait();
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
}
