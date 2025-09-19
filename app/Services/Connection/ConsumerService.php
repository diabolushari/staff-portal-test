<?php

namespace App\Services\Connection;

use App\Http\Requests\Connections\ConsumerFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\GrpcServiceResponse;
use Google\Protobuf\Struct;
use Google\Protobuf\Value;
use Grpc\ChannelCredentials;
use Proto\Connections\AddressMessage;
use Proto\Connections\ConsumerAddressMessage;
use Proto\Connections\ConsumerContactDetailMessage;
use Proto\Connections\ConsumerCreateRequest;
use Proto\Connections\ConsumerIdRequest;
use Proto\Connections\ConsumerMessage;
use Proto\Connections\ConsumerServiceClient;
use Proto\Connections\ConsumerUpdateRequest;
use Proto\Connections\ContactMessage;

class ConsumerService
{
    private ConsumerServiceClient $client;

    public function __construct(
        private ParameterValueService $parameterValueService
    ) {
        $this->client = new ConsumerServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function createConsumer(ConsumerFormRequest $request): GrpcServiceResponse
    {

        $grpcRequest = new ConsumerCreateRequest;
        $grpcRequest->setConsumer($this->toConsumerProfile($request));
        $grpcRequest->setAddress($this->toConsumerAddress($request));
        $grpcRequest->setContact($this->toContactInfo($request));

        [$response, $status] = $this->client->createConsumer($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success([], $response, $status->code, $status->details);
    }

    public function getConsumer(int $connectionId): GrpcServiceResponse
    {

        $grpcRequest = new ConsumerIdRequest;
        $grpcRequest->setConnectionId($connectionId);

        [$response, $status] = $this->client->getConsumerById($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details,
            );
        }

        $connection = $response->getConsumer();
        $contact = $response->getContact();

        return GrpcServiceResponse::success(
            [
                'consumer' => $this->transformConsumerToArray($connection),
                'contact' => $this->transformContactToArray($contact),
            ],
            $response,
            $status->code,
            $status->details
        );
    }

    public function updateConsumer(ConsumerFormRequest $request, int $connectionId): GrpcServiceResponse
    {

        $grpcRequest = new ConsumerUpdateRequest;
        $grpcRequest->setConsumer($this->toConsumerProfile($request));
        $grpcRequest->setAddress($this->toConsumerAddress($request));
        $grpcRequest->setContact($this->toContactInfo($request));

        [$response, $status] = $this->client->updateConsumer($grpcRequest)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, null, false),
                $response,
                $status->code,
                $status->details

            );
        }

        return GrpcServiceResponse::success([], $response, $status->code, $status->details);
    }

    // -------------------- Helper Methods --------------------

    public function toConsumerProfile(ConsumerFormRequest $request): ConsumerMessage
    {
        $consumer = new ConsumerMessage;
        $consumer->setConnectionId($request->connectionId);
        $consumer->setConsumerTypeId($request->consumerTypeId);
        $consumer->setOrganizationName($request->organizationName);
        $consumer->setApplicantCode($request->applicantCode);
        $consumer->setConsumerPan($request->consumerPan);
        $consumer->setConsumerTan($request->consumerTan);
        $consumer->setConsumerGstin($request->consumerGstin);
        $consumer->setIncomeTaxWithholdingInd($request->incomeTaxWithholdingInd);
        $consumer->setGstWithholdingInd($request->gstWithholdingInd);
        $consumer->setManufacturingInfo(new Struct);
        $consumer->setTaxInfo(new Struct);
        $consumer->setIdentityInfo(new Struct);
        $consumer->setApplicationInfo(new Struct);

        // Convert billing & premises addresses to Struct
        $pendingAddresses = $request->otherAddresses ?? [];
        $addresses = [];
        if (isset($pendingAddresses['billing'])) {
            $addresses['billing'] = $pendingAddresses['billing'];
        }
        if (isset($pendingAddresses['premises'])) {
            $addresses['premises'] = $pendingAddresses['premises'];
        }
        $consumer->setAddresses($this->arrayToStruct($addresses));

        return $consumer;
    }

    public function toConsumerAddress(ConsumerFormRequest $request): AddressMessage
    {
        $address = new AddressMessage;
        $address->setAddressId($request->addressId ?? 0);
        $address->setAddressLine1($request->addressLine1);
        $address->setAddressLine2($request->addressLine2);
        $address->setCityTownVillage($request->cityTownVillage);
        $address->setPincode($request->pincode);
        $address->setDistrictId($request->districtId);
        $address->setStateId($request->stateId);

        return $address;
    }

    public function toContactInfo(ConsumerFormRequest $request): ContactMessage
    {
        $contact = new ContactMessage;
        $contact->setConnectionId($request->connectionId);
        $contact->setPrimaryEmail($request->primaryEmail);
        $contact->setPrimaryPhone($request->primaryPhone);
        $contact->setContactFolio(new Struct);

        return $contact;
    }

    /**
     * @return array<string, mixed>
     */
    public function transformConsumerToArray(ConsumerMessage $consumer): array
    {
        return [
            'connection_id' => $consumer->getConnectionId(),
            'consumer_type_id' => $consumer->getConsumerTypeId(),
            'organization_name' => $consumer->getOrganizationName(),
            'applicant_code' => $consumer->getApplicantCode(),
            'consumer_pan' => $consumer->getConsumerPan(),
            'consumer_tan' => $consumer->getConsumerTan(),
            'consumer_gstin' => $consumer->getConsumerGstin(),
            'income_tax_withholding_ind' => $consumer->getIncomeTaxWithholdingInd(),
            'gst_withholding_ind' => $consumer->getGstWithholdingInd(),
            'manufacturing_info' => $consumer->getManufacturingInfo(),
            'tax_info' => $consumer->getTaxInfo(),
            'identity_info' => $consumer->getIdentityInfo(),
            'application_info' => $consumer->getApplicationInfo(),
            'consumer_type' => $this->parameterValueService->toArray($consumer->getConsumerType()),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function transformContactToArray(ConsumerContactDetailMessage $contact): array
    {
        return [
            'connection_id' => $contact->getConnectionId(),
            'version_id' => $contact->hasVersionId() ? $contact->getVersionId() : null,
            'primary_address_id' => $contact->getPrimaryAddressId(),
            'billing_address_id' => $contact->getBillingAddressId(),
            'premises_address_id' => $contact->getPremisesAddressId(),
            'primary_email' => $contact->getPrimaryEmail(),
            'primary_phone' => $contact->getPrimaryPhone(),
            'contact_folio' => $contact->getContactFolio()?->serializeToJsonString(),
            'primary_address' => $this->addressToArray($contact->getPrimaryAddress()),
            'billing_address' => $this->addressToArray($contact->getBillingAddress()),
            'premises_address' => $this->addressToArray($contact->getPremisesAddress()),
        ];
    }

    /**
     * @param  array<string, mixed>  $arr
     */
    public function arrayToStruct(array $arr): Struct
    {
        $struct = new Struct;
        $fields = [];
        foreach ($arr as $key => $value) {
            $val = new Value;
            if (is_array($value)) {
                $val->setStructValue($this->arrayToStruct($value));
            } elseif (is_bool($value)) {
                $val->setBoolValue($value);
            } elseif (is_numeric($value)) {
                if (is_int($value)) {
                    $val->setNumberValue((float) $value);
                } elseif (is_float($value)) {
                    $val->setNumberValue($value);
                } elseif (is_string($value)) {
                    $val->setNumberValue((float) $value);
                }
            } else {
                $val->setStringValue((string) $value);
            }
            $fields[$key] = $val;
        }
        $struct->setFields($fields);

        return $struct;
    }

    /**
     * @return array<string, mixed>
     */
    private function addressToArray(?ConsumerAddressMessage $address): ?array
    {
        if ($address === null) {
            return null;
        }

        return [
            'address_id' => $address->getAddressId(),
            'address_line1' => $address->getAddressLine1(),
            'address_line2' => $address->getAddressLine2(),
            'city_town_village' => $address->getCityTownVillage(),
            'state_id' => $address->getStateId(),
            'pincode' => $address->getPincode(),
            'district_id' => $address->getDistrictId(),
        ];
    }
}
