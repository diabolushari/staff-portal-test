<?php

namespace App\Services\Parties;

use App\Http\Requests\Parties\PartiesFormRequest;
use App\Http\Requests\Parties\PartyFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Carbon\Carbon;
use Google\Protobuf\GPBEmpty;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Consumers\PartyCreateRequest;
use Proto\Consumers\PartyIdRequest;
use Proto\Consumers\PartyServiceClient;
use Proto\Consumers\PartyUpdateRequest;

class PartyService
{
    private PartyServiceClient $client;

    public function __construct()
    {
        $this->client = new PartyServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    /**
     * Get list of all parties
     */
    public function getParties(): GrpcServiceResponse
    {
        $request = new GPBEmpty;

        [$response, $status] = $this->client->ListParties($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        $parties = $response?->getParties();
        $partiesArray = [];

        if ($parties) {
            foreach ($parties as $party) {
                $partiesArray[] = $this->transformPartyToArray($party);
            }
        }

        return GrpcServiceResponse::success($partiesArray, $response, $status->code, $status->details);
    }

    /**
     * Get a specific party by version ID
     */
    public function getParty(int $versionId): GrpcServiceResponse
    {
        $request = new PartyIdRequest;
        $request->setVersionId($versionId);

        [$response, $status] = $this->client->GetPartyById($request)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        $party = $response->getParty();
        $partyArray = $this->transformPartyToArray($party);

        return GrpcServiceResponse::success($partyArray, $response, $status->code, $status->details);
    }

    /**
     * Create a new party
     */
    public function createParty(PartiesFormRequest $request): GrpcServiceResponse
    {
        // Convert to array to get snake_case keys
        $requestData = $request->toArray();

        $grpcRequest = new PartyCreateRequest;

        // Set optional fields only if they exist
        if (! empty($requestData['party_id'])) {
            $grpcRequest->setPartyId($requestData['party_id']);
        }
        if (! empty($requestData['party_code'])) {
            $grpcRequest->setPartyCode($requestData['party_code']);
        }
        if (! empty($requestData['party_legacy_code'])) {
            $grpcRequest->setPartyLegacyCode($requestData['party_legacy_code']);
        }
        if (! empty($requestData['name'])) {
            $grpcRequest->setName($requestData['name']);
        }
        if (! empty($requestData['party_type_id'])) {
            $grpcRequest->setPartyTypeId($requestData['party_type_id']);
        }
        if (! empty($requestData['status_id'])) {
            $grpcRequest->setStatusId($requestData['status_id']);
        }

        // Handle timestamps
        if (! empty($requestData['effective_start'])) {
            $grpcRequest->setEffectiveStart($this->convertToTimestamp($requestData['effective_start']));
        }
        if (! empty($requestData['effective_end'])) {
            $grpcRequest->setEffectiveEnd($this->convertToTimestamp($requestData['effective_end']));
        }

        $grpcRequest->setIsCurrent($requestData['is_current'] ?? true);

        if (! empty($requestData['created_by'])) {
            $grpcRequest->setCreatedBy($requestData['created_by']);
        }

        [$response, $status] = $this->client->CreateParty($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        $party = $response->getParty();  // Access party as property, not getParty()
        $partyArray = $this->transformPartyToArray($party);

        return GrpcServiceResponse::success($partyArray, $response, $status->code, $status->details);
    }

    /*
     * Update an existing party
     */
    public function updateParty(PartyFormRequest $request, int $versionId): GrpcServiceResponse
    {
        $grpcRequest = new PartyUpdateRequest;
        $grpcRequest->setVersionId($versionId);

        // Set optional fields only if they exist
        if ($request->has('party_id') && $request->party_id) {
            $grpcRequest->setPartyId($request->party_id);
        }

        if ($request->has('party_code') && $request->party_code) {
            $grpcRequest->setPartyCode($request->party_code);
        }

        $grpcRequest->setPartyLegacyCode($request->party_legacy_code);
        $grpcRequest->setName($request->name);

        if ($request->has('party_type_id') && $request->party_type_id) {
            $grpcRequest->setPartyTypeId($request->party_type_id);
        }

        if ($request->has('status_id') && $request->status_id) {
            $grpcRequest->setStatusId($request->status_id);
        }

        // Handle timestamps
        $grpcRequest->setEffectiveStart($this->convertToTimestamp($request->effective_start));
        $grpcRequest->setEffectiveEnd($this->convertToTimestamp($request->effective_end));
        $grpcRequest->setIsCurrent($request->is_current ?? true);
        $grpcRequest->setUpdatedBy($request->updated_by);

        [$response, $status] = $this->client->UpdateParty($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        $party = $response->getParty();
        $partyArray = $this->transformPartyToArray($party);

        return GrpcServiceResponse::success($partyArray, $response, $status->code, $status->details);
    }

    /**
     * Delete a party
     */
    public function deleteParty(int $versionId): GrpcServiceResponse
    {
        $grpcRequest = new PartyIdRequest;
        $grpcRequest->setVersionId($versionId);

        [$response, $status] = $this->client->DeleteParty($grpcRequest)->wait();

        $errorResponse = GrpcErrorService::handleErrorResponse($status);
        if ($errorResponse !== null) {
            return GrpcServiceResponse::error($errorResponse, $response, $status->code, $status->details);
        }

        // Delete returns Empty; no payload data
        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }

    /**
     * Transform PartyMessage protobuf to PHP array
     */
    private function transformPartyToArray($party): array
    {
        return [
            'version_id' => $party->getVersionId(),
            'party_id' => $party->getPartyId(),
            'party_code' => $party->getPartyCode(),
            'party_legacy_code' => $party->getPartyLegacyCode(),
            'name' => $party->getName(),
            'party_type_id' => $party->getPartyTypeId(),
            'status_id' => $party->getStatusId(),
            'effective_start' => $this->convertFromTimestamp($party->getEffectiveStart()),
            'effective_end' => $this->convertFromTimestamp($party->getEffectiveEnd()),
            'is_current' => $party->getIsCurrent(),
            'created_by' => $party->getCreatedBy(),
            'updated_by' => $party->getUpdatedBy(),
            'created_at' => $this->convertFromTimestamp($party->getCreatedAt()),
            'updated_at' => $this->convertFromTimestamp($party->getUpdatedAt()),
        ];
    }

    /**
     * Convert PHP DateTime/Carbon to protobuf Timestamp
     */
    private function convertToTimestamp($dateTime): Timestamp
    {
        if (is_string($dateTime)) {
            $carbon = Carbon::parse($dateTime);
        } elseif ($dateTime instanceof Carbon) {
            $carbon = $dateTime;
        } elseif ($dateTime instanceof \DateTime) {
            $carbon = Carbon::instance($dateTime);
        } else {
            $carbon = Carbon::now();
        }

        $timestamp = new Timestamp;
        $timestamp->setSeconds($carbon->getTimestamp());
        $timestamp->setNanos($carbon->micro * 1000);

        return $timestamp;
    }

    /**
     * Convert protobuf Timestamp to Carbon
     */
    private function convertFromTimestamp(?Timestamp $timestamp): ?string
    {
        if ($timestamp === null) {
            return null;
        }

        $seconds = $timestamp->getSeconds();
        $nanos = $timestamp->getNanos();

        $carbon = Carbon::createFromTimestamp($seconds);
        $carbon->addMicroseconds(intval($nanos / 1000));

        return $carbon->toISOString();
    }
}
