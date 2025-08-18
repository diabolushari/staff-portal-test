<?php

namespace App\Services\Consumers;

use App\Http\Requests\Consumers\OfficeFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use DateTime;
use Google\Protobuf\Timestamp;
use Proto\Consumers\OfficeServiceClient;
use Grpc\ChannelCredentials;
use Proto\Consumers\OfficeCreateRequest;
use Proto\Consumers\OfficeIdRequest;
use Proto\Consumers\OfficeListRequest;

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
    public function getOffices(int $page = 1, int $pageSize = 10, ?string $search, ?string $officeType, ?string $officeName): GrpcServiceResponse
    {
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
            $officeType = $office->getOfficeType();

            $officesArray[] = [
                'office_id' => $office->getOfficeId(),
                'office_name' => $office->getOfficeName(),
                'office_code' => $office->getOfficeCode(),

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
        $proto->setParentOfficeId((int)$request->parentId ?? null);
        if (!empty($request->effectiveStart)) {
            $effectiveStart = new Timestamp();
            // assuming $request->effectiveStart is like "2025-08-18" or "2025-08-18 10:30:00"
            $effectiveStart->fromDateTime(new DateTime($request->effectiveStart));
            $proto->setEffectiveStart($effectiveStart);
        }

        // effective_end
        if (!empty($request->effectiveEnd)) {
            $effectiveEnd = new Timestamp();
            $effectiveEnd->fromDateTime(new DateTime($request->effectiveEnd));
            $proto->setEffectiveEnd($effectiveEnd);
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
        return GrpcServiceResponse::success($response, $response, $status->code, $status->details);
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
        return GrpcServiceResponse::success($response, $response, $status->code, $status->details);
    }
}
