<?php

namespace App\Services\Billing;

use App\Http\Requests\Billing\ComputedPropertyFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\ArrayToStructConverter;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\GrpcServiceResponse;
use App\Services\utils\StructConverter;
use Grpc\ChannelCredentials;
use Proto\Billing\ComputedPropertyFormMessage;
use Proto\Billing\ComputedPropertyMessage;
use Proto\Billing\ComputedPropertyServiceClient;
use Proto\Billing\CreateComputedPropertyRequest;

class ComputedPropertyService
{
    private ComputedPropertyServiceClient $client;

    public function __construct()
    {
        $this->client = new ComputedPropertyServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listComputedProperties() {}

    public function createComputedProperty(ComputedPropertyFormRequest $request): GrpcServiceResponse
    {
        $proto = new CreateComputedPropertyRequest;
        $proto->setComputedProperty($this->ComputedPropertyFormRequestToProto($request));
        [$response, $status] = $this->client->CreateComputedProperty($proto)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $computedProperty = [];
        if ($response->getComputedProperty() != null) {
            $computedProperty = $this->computedPropertyMessageToArray($response->getComputedProperty());
        }

        return GrpcServiceResponse::success($computedProperty, $response, $status->code, $status->details);
    }

    public function getComputedProperty() {}

    public function updateComputedProperty() {}

    public function deleteComputedProperty() {}

    public function ComputedPropertyFormRequestToProto(ComputedPropertyFormRequest $request): ComputedPropertyFormMessage
    {
        $proto = new ComputedPropertyFormMessage;
        if ($request->computedPropertyId != null) {
            $proto->setId($request->computedPropertyId);
        }
        $proto->setBillingRuleId($request->billingRuleId);
        $proto->setName($request->name);
        $proto->setEffectiveStart(DateTimeConverter::convertStringToTimestamp($request->effectiveStart));
        if ($request->effectiveEnd != null) {
            $proto->setEffectiveEnd(DateTimeConverter::convertStringToTimestamp($request->effectiveEnd));
        }
        $proto->setCalculations(ArrayToStructConverter::convert($request->calculations));

        return $proto;
    }

    public function computedPropertyMessageToArray(ComputedPropertyMessage $computedPropertyMessage): array
    {
        return [
            'id' => $computedPropertyMessage->getId(),
            'billing_rule_id' => $computedPropertyMessage->getBillingRuleId(),
            'name' => $computedPropertyMessage->getName(),
            'effective_start' => DateTimeConverter::convertTimestampToString($computedPropertyMessage->getEffectiveStart()),
            'effective_end' => DateTimeConverter::convertTimestampToString($computedPropertyMessage->getEffectiveEnd()),
            'created_at' => DateTimeConverter::convertTimestampToString($computedPropertyMessage->getCreatedTs()),
            'updated_at' => DateTimeConverter::convertTimestampToString($computedPropertyMessage->getUpdatedTs()),
            'deleted_at' => DateTimeConverter::convertTimestampToString($computedPropertyMessage->getDeletedTs()),
            'created_by' => $computedPropertyMessage->getCreatedBy(),
            'updated_by' => $computedPropertyMessage->getUpdatedBy(),
            'deleted_by' => $computedPropertyMessage->getDeletedBy(),
            'calculations' => $computedPropertyMessage->getCalculations() != null ? StructConverter::convert($computedPropertyMessage->getCalculations()) : null,
        ];
    }
}
