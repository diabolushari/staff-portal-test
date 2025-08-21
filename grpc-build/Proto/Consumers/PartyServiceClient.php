<?php
// GENERATED CODE -- DO NOT EDIT!

namespace Proto\Consumers;

/**
 * Service to manage Party entities with versioning.
 */
class PartyServiceClient extends \Grpc\BaseStub {

    /**
     * @param string $hostname hostname
     * @param array $opts channel options
     * @param \Grpc\Channel $channel (optional) re-use channel object
     */
    public function __construct($hostname, $opts, $channel = null) {
        parent::__construct($hostname, $opts, $channel);
    }

    /**
     * @param \Proto\Consumers\CreatePartyRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function CreateParty(\Proto\Consumers\CreatePartyRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.consumers.PartyService/CreateParty',
        $argument,
        ['\Proto\Consumers\PartyResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\UpdatePartyRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function UpdateParty(\Proto\Consumers\UpdatePartyRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.consumers.PartyService/UpdateParty',
        $argument,
        ['\Proto\Consumers\PartyResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\DeletePartyRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function DeleteParty(\Proto\Consumers\DeletePartyRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.consumers.PartyService/DeleteParty',
        $argument,
        ['\Google\Protobuf\GPBEmpty', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\GetCurrentPartyRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function GetCurrentParty(\Proto\Consumers\GetCurrentPartyRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.consumers.PartyService/GetCurrentParty',
        $argument,
        ['\Proto\Consumers\PartyResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\GetPartyByVersionIdRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function GetPartyByVersionId(\Proto\Consumers\GetPartyByVersionIdRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.consumers.PartyService/GetPartyByVersionId',
        $argument,
        ['\Proto\Consumers\PartyResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\GetPartyHistoryRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function GetPartyHistory(\Proto\Consumers\GetPartyHistoryRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.consumers.PartyService/GetPartyHistory',
        $argument,
        ['\Proto\Consumers\PartyListResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Google\Protobuf\GPBEmpty $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function ListCurrentParties(\Google\Protobuf\GPBEmpty $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.consumers.PartyService/ListCurrentParties',
        $argument,
        ['\Proto\Consumers\PartyListResponse', 'decode'],
        $metadata, $options);
    }

}
