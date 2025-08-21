<?php
// GENERATED CODE -- DO NOT EDIT!

namespace Proto\Consumers;

/**
 * ------------ SERVICE ------------
 *
 */
class OrgElementAddressServiceClient extends \Grpc\BaseStub {

    /**
     * @param string $hostname hostname
     * @param array $opts channel options
     * @param \Grpc\Channel $channel (optional) re-use channel object
     */
    public function __construct($hostname, $opts, $channel = null) {
        parent::__construct($hostname, $opts, $channel);
    }

    /**
     * @param \Proto\Consumers\OrgElementAddressCreateRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function CreateOrgElementAddress(\Proto\Consumers\OrgElementAddressCreateRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OrgElementAddressService/CreateOrgElementAddress',
        $argument,
        ['\Proto\Consumers\OrgElementAddressResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\OrgElementAddressIdRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function GetOrgElementAddressById(\Proto\Consumers\OrgElementAddressIdRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OrgElementAddressService/GetOrgElementAddressById',
        $argument,
        ['\Proto\Consumers\OrgElementAddressResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Google\Protobuf\GPBEmpty $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function ListOrgElementAddresses(\Google\Protobuf\GPBEmpty $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OrgElementAddressService/ListOrgElementAddresses',
        $argument,
        ['\Proto\Consumers\OrgElementAddressListResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\OrgElementAddressUpdateRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function UpdateOrgElementAddress(\Proto\Consumers\OrgElementAddressUpdateRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OrgElementAddressService/UpdateOrgElementAddress',
        $argument,
        ['\Proto\Consumers\OrgElementAddressResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\OrgElementAddressIdRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function DeleteOrgElementAddress(\Proto\Consumers\OrgElementAddressIdRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OrgElementAddressService/DeleteOrgElementAddress',
        $argument,
        ['\Google\Protobuf\GPBEmpty', 'decode'],
        $metadata, $options);
    }

}
