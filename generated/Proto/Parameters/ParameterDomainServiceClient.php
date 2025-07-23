<?php
// GENERATED CODE -- DO NOT EDIT!

namespace Proto\Parameters;

/**
 * ------------ SERVICE ------------
 */
class ParameterDomainServiceClient extends \Grpc\BaseStub {

    /**
     * @param string $hostname hostname
     * @param array $opts channel options
     * @param \Grpc\Channel $channel (optional) re-use channel object
     */
    public function __construct($hostname, $opts, $channel = null) {
        parent::__construct($hostname, $opts, $channel);
    }

    /**
     * @param \Proto\Parameters\CreateParameterDomainRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function CreateParameterDomain(\Proto\Parameters\CreateParameterDomainRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterDomainService/CreateParameterDomain',
        $argument,
        ['\Proto\Parameters\ParameterDomainProto', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\GetParameterDomainRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function GetParameterDomain(\Proto\Parameters\GetParameterDomainRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterDomainService/GetParameterDomain',
        $argument,
        ['\Proto\Parameters\ParameterDomainProto', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\UpdateParameterDomainRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function UpdateParameterDomain(\Proto\Parameters\UpdateParameterDomainRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterDomainService/UpdateParameterDomain',
        $argument,
        ['\Proto\Parameters\ParameterDomainProto', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\DeleteParameterDomainRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function DeleteParameterDomain(\Proto\Parameters\DeleteParameterDomainRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterDomainService/DeleteParameterDomain',
        $argument,
        ['\Google\Protobuf\GPBEmpty', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\ListParameterDomainsRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function ListParameterDomains(\Proto\Parameters\ListParameterDomainsRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterDomainService/ListParameterDomains',
        $argument,
        ['\Proto\Parameters\ListParameterDomainsResponse', 'decode'],
        $metadata, $options);
    }

}
