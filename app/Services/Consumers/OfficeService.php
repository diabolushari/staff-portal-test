<?php

namespace App\Services\Consumers;

use App\Http\Requests\Consumers\OfficeFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Consumers\OfficeCreateRequest;
use Proto\Consumers\OfficeIdRequest;
use Proto\Consumers\OfficeListRequest;
use Proto\Consumers\OfficeMessage;
use Proto\Consumers\OfficeServiceClient;
use Proto\Consumers\OfficeUpdateRequest;

class OfficeService
{
    private $client;

    public function __construct()
    {
        $this->client = new OfficeServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function getOffices(
        int $page = 1,
        int $pageSize = 10,
        ?string $search = null,
        ?string $officeType = null,
        ?string $officeName = null
    ): GrpcServiceResponse {
        $request = new OfficeListRequest;
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
            $officesArray[] = self::officeProtoToArray($office);
        }

        return GrpcServiceResponse::success($officesArray, $response, $status->code, $status->details);
    }

    public function createOffice(OfficeFormRequest $request): GrpcServiceResponse
    {
        $proto = new OfficeCreateRequest;
        $proto->setOfficeName($request->officeName);
        $proto->setOfficeCode($request->officeCode);
        $proto->setOfficeDescription($request->officeDescription);
        $proto->setOfficeTypeId($request->officeTypeId);
        if ($request->parentOfficeId !== null) {
            $proto->setParentOfficeId($request->parentOfficeId);
        }
        [$response, $status] = $this->client->CreateOffice($proto)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $office = $response?->getOffice();
        $officeArray = self::officeProtoToArray($office);

        return GrpcServiceResponse::success($officeArray, $response, $status->code, $status->details);
    }

    public function getOffice(int $id): GrpcServiceResponse
    {
        $request = new OfficeIdRequest;
        $request->setOfficeId((int) $id);
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
        $officeArray = self::officeProtoToArray($office);

        return GrpcServiceResponse::success($officeArray, $response, $status->code, $status->details);
    }

    public function updateOffice(OfficeFormRequest $request, int $id): GrpcServiceResponse
    {
        $proto = new OfficeUpdateRequest;
        $proto->setOfficeId($id);
        $proto->setOfficeName($request->officeName);
        $proto->setOfficeCode($request->officeCode);
        $proto->setOfficeDescription($request->officeDescription);
        $proto->setOfficeTypeId($request->officeTypeId);

        if ($request->parentOfficeId !== null) {
            $proto->setParentOfficeId($request->parentOfficeId);
        }

        [$response, $status] = $this->client->UpdateOffice($proto)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $responseOffice = $response->getOffice();
        $officeArray = self::officeProtoToArray($responseOffice);

        return GrpcServiceResponse::success($officeArray, $response, $status->code, $status->details);
    }

    public function deleteOffice(int $id): GrpcServiceResponse
    {
        $request = new OfficeIdRequest;
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

    /**
     * Static utility function to convert OfficeMessage proto to associative array
     * Includes parent office, location, and office address data
     */
    public static function officeProtoToArray(OfficeMessage $office): array
    {
        // Handle contact folio (Google\Protobuf\Struct)
        $contactFolio = [];
        $contactFolioStruct = $office->getContactFolio();
        if ($contactFolioStruct) {
            $contactFolioJsonString = $contactFolioStruct->serializeToJsonString();
            $contactFolio = json_decode($contactFolioJsonString, true);
        }

        // Format timestamps
        $effectiveStart = $office->getEffectiveStart()
            ? $office->getEffectiveStart()->toDateTime()->format('Y-m-d')
            : null;

        $effectiveEnd = $office->getEffectiveEnd()
            ? $office->getEffectiveEnd()->toDateTime()->format('Y-m-d')
            : null;

        $createdAt = $office->getCreatedAt()
            ? $office->getCreatedAt()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        $updatedAt = $office->getUpdatedAt()
            ? $office->getUpdatedAt()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        // Handle office type
        $officeTypeArray = null;
        $officeType = $office->getOfficeType();
        if ($officeType) {
            $officeTypeArray = [
                'office_type_id' => $officeType->getId(),
                'parameter_code' => $officeType->getParameterCode(),
                'parameter_value' => $officeType->getParameterValue(),
            ];
        }

        // Handle parent office (recursive)
        $parentOfficeArray = null;
        $parentOffice = $office->getParentOffice();
        if ($parentOffice) {
            $parentOfficeArray = self::officeProtoToArray($parentOffice);
        }

        return [
            'office_id' => $office->getOfficeId(),
            'office_name' => $office->getOfficeName(),
            'office_code' => $office->getOfficeCode(),
            'office_description' => $office->getOfficeDescription(),
            'office_type_id' => $office->getOfficeTypeId(),
            'parent_office_id' => $office->getParentOfficeId(),
            'location_id' => $office->getLocationId(),
            'office_address_id' => $office->getOfficeAddressId(),
            'effective_start' => $effectiveStart,
            'effective_end' => $effectiveEnd,
            'is_current' => $office->getIsCurrent(),
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
            'created_by' => $office->getCreatedBy(),
            'updated_by' => $office->getUpdatedBy(),
            'contact_folio' => $contactFolio,
            'office_type' => $officeTypeArray,
            'parent_office' => $parentOfficeArray,
        ];
    }
}
