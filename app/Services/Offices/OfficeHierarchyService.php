<?php

namespace App\Services\Offices;

use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Offices\OfficeHierarchyListRequest;
use Proto\Offices\OfficeHierarchyMessage;
use Proto\Offices\OfficeHierarchyServiceClient;

class OfficeHierarchyService
{
    private OfficeHierarchyServiceClient $client;

    public function __construct()
    {
        $this->client = new OfficeHierarchyServiceClient(
            config('app.consumer_service_grpc_host'),
            [
                'credentials' => ChannelCredentials::createInsecure(),
            ]
        );
    }

    public function getOfficeHierarchies(int $page = 1, int $pageSize = 10, ?string $search = null): GrpcServiceResponse
    {
        $request = new OfficeHierarchyListRequest;
        $request->setPage($page);
        $request->setSize($pageSize);
        if ($search !== null && $search !== '') {
            $request->setHierarchyCode($search);
            $request->setHierarchyName($search);
        }

        [$response, $status] = $this->client->ListOfficeHierarchies($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $officeHierarchiesArray = [];
        foreach ($response->getOfficeHierarchies() as $officeHierarchy) {
            $officeHierarchiesArray[] = $this->officeHierarchiesToArray($officeHierarchy);
        }

        return GrpcServiceResponse::success($officeHierarchiesArray, $response, $status->code, $status->details);
    }

    /**
     * @return array<string, mixed>
     */
    public function officeHierarchiesToArray(OfficeHierarchyMessage $officeHierarchy): array
    {
        return [
            'hierarchy_id' => $officeHierarchy->getHierarchyId(),
            'hierarchy_code' => $officeHierarchy->getHierarchyCode(),
            'hierarchy_name' => $officeHierarchy->getHierarchyName(),
            'hierarchy_description' => $officeHierarchy->getHierarchyDescription(),
            'is_current' => $officeHierarchy->getIsCurrent(),
        ];
    }
}
