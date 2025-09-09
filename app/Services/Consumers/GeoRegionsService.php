<?php

namespace App\Services\Consumers;

use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Consumers\GeoRegionServiceClient;
use Proto\Consumers\GeoRegionListRequest;
use Proto\Consumers\GeoRegionMessage;

class GeoRegionsService
{
    private GeoRegionServiceClient $client;

    public function __construct()
    {
        $this->client = new GeoRegionServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function getGeoRegions(?string $regionClassification = null, ?string $regionType = null): GrpcServiceResponse
    {
        $request = new GeoRegionListRequest();
        if ($regionClassification !== null) {
            $request->setRegionClassification($regionClassification);
        }
        if ($regionType !== null) {
            $request->setRegionType($regionType);
        }
        [$response, $status] = $this->client->ListGeoRegions($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $geoRegionsArray = [];
        foreach ($response->getRegions() as $region) {
            $geoRegionsArray[] = self::geoRegionProtoToArray($region);
        }

        return GrpcServiceResponse::success($geoRegionsArray, $response, $status->code, $status->details);
    }

    private static function geoRegionProtoToArray(GeoRegionMessage $region): array
    {
        return [
            'region_id' => $region->getRegionId(),
            'region_name' => $region->getRegionName(),
            'region_classification' => $region->getRegionClassification(),
            'region_type_id' => $region->getRegionTypeId(),
            'parent_region_id' => $region->getParentRegionId(),
            'region_attributes' => $region->getRegionAttributes()?->getFields() ?? [],
        ];
    }
}
