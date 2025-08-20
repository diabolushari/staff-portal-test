<?php
// GENERATED CODE -- DO NOT EDIT!

namespace Proto\Consumers;

/**
 * ------------ SERVICE ------------
 *
 */
class OrgElementLocationServiceClient extends \Grpc\BaseStub {

    /**
     * @param string $hostname hostname
     * @param array $opts channel options
     * @param \Grpc\Channel $channel (optional) re-use channel object
     */
    public function __construct($hostname, $opts, $channel = null) {
        parent::__construct($hostname, $opts, $channel);
    }

    /**
     * @param \Proto\Consumers\OrgElementLocationMessage $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function CreateOrgElementLocation(\Proto\Consumers\OrgElementLocationMessage $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OrgElementLocationService/CreateOrgElementLocation',
        $argument,
        ['\Proto\Consumers\OrgElementLocationResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\OrgElementLocationIdRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function GetOrgElementLocationById(\Proto\Consumers\OrgElementLocationIdRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OrgElementLocationService/GetOrgElementLocationById',
        $argument,
        ['\Proto\Consumers\OrgElementLocationResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Google\Protobuf\GPBEmpty $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function GetAllOrgElementLocations(\Google\Protobuf\GPBEmpty $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OrgElementLocationService/GetAllOrgElementLocations',
        $argument,
        ['\Proto\Consumers\OrgElementLocationListResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\OrgElementLocationMessage $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function UpdateOrgElementLocation(\Proto\Consumers\OrgElementLocationMessage $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OrgElementLocationService/UpdateOrgElementLocation',
        $argument,
        ['\Proto\Consumers\OrgElementLocationResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\OrgElementLocationIdRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function DeleteOrgElementLocation(\Proto\Consumers\OrgElementLocationIdRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OrgElementLocationService/DeleteOrgElementLocation',
        $argument,
        ['\Google\Protobuf\GPBEmpty', 'decode'],
        $metadata, $options);
    }

}
