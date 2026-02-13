<?php

namespace App\Services\Calendar;

use App\Http\Requests\Calendar\CalendarUpdateFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Calendar\CalendarPaginatedListRequest;
use Proto\Calendar\CalendarPaginatedListResponse;
use Proto\Calendar\CalendarResponse;
use Proto\Calendar\CalendarServiceClient;
use Proto\Calendar\UpdateCalendarRequest;

class CalendarService
{
    private CalendarServiceClient $client;

    public function __construct()
    {
        $this->client = new CalendarServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

   
    public function listCalendarPaginated(
        ?int $pageNumber = 1,
        ?int $pageSize = 20,
        ?string $fromDate = null,
        ?string $toDate = null,
        ?string $sortBy = null,
        ?string $sortDirection = null
    ): GrpcServiceResponse {

        $grpcRequest = new CalendarPaginatedListRequest();

        if ($pageNumber) {
            $grpcRequest->setPageNumber($pageNumber);
        }

        if ($pageSize) {
            $grpcRequest->setPageSize($pageSize);
        }

        if ($fromDate) {
            $grpcRequest->setFromDate($fromDate);
        }

        if ($toDate) {
            $grpcRequest->setToDate($toDate);
        }

        if ($sortBy) {
            $grpcRequest->setSortBy($sortBy);
        }

        if ($sortDirection) {
            $grpcRequest->setSortDirection($sortDirection);
        }

        [$response, $status] =
            $this->client->listCalendarPaginated($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            $this->convertToPaginatedArray($response),
            $response,
            $status->code,
            $status->details
        );
    }

    /**
     * Update calendar row
     */
    public function updateCalendar(int $id, CalendarUpdateFormRequest $request): GrpcServiceResponse
    {
        $grpcRequest = new UpdateCalendarRequest();
        $grpcRequest->setId($id);
        $grpcRequest->setIsHoliday($request->isHoliday);
        $grpcRequest->setIsWeekend($request->isWeekend);
        $grpcRequest->setRemarks($request->remarks ?? '');

        [$response, $status] =
            $this->client->updateCalendar($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            $this->calendarMessageToArray($response),
            $response,
            $status->code,
            $status->details
        );
    }

    
    private function calendarMessageToArray(CalendarResponse $msg): array
    {
        return [
            'id' => $msg->getId(),
            'calendar_date' => $msg->getCalendarDate(),
            'is_holiday' => $msg->getIsHoliday(),
            'is_weekend' => $msg->getIsWeekend(),
            'day_of_week' => $msg->getDayOfWeek(),
            'day_of_year' => $msg->getDayOfYear(),
            'remarks' => $msg->getRemarks(),
        ];
    }

    
    private function convertToPaginatedArray(CalendarPaginatedListResponse $response): array
    {
        $rows = [];
        foreach ($response->getData() as $item) {
            $rows[] = $this->calendarMessageToArray($item);
        }

        return [
            'data' => $rows,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];
    }
}
