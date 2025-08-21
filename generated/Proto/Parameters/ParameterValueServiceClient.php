<?php
// GENERATED CODE -- DO NOT EDIT!

namespace Proto\Parameters;

/**
 * ----------- SERVICE ------------
 */
class ParameterValueServiceClient extends \Grpc\BaseStub {

    /**
     * @param string $hostname hostname
     * @param array $opts channel options
     * @param \Grpc\Channel $channel (optional) re-use channel object
     */
    public function __construct($hostname, $opts, $channel = null) {
        parent::__construct($hostname, $opts, $channel);
    }

    /**
     * @param \Proto\Parameters\CreateParameterValueRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall<\Proto\Parameters\ParameterValueProto>
     */
    public function CreateParameterValue(\Proto\Parameters\CreateParameterValueRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterValueService/CreateParameterValue',
        $argument,
        ['\Proto\Parameters\ParameterValueProto', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\UpdateParameterValueRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall<\Proto\Parameters\ParameterValueProto>
     */
    public function UpdateParameterValue(\Proto\Parameters\UpdateParameterValueRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterValueService/UpdateParameterValue',
        $argument,
        ['\Proto\Parameters\ParameterValueProto', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\GetParameterValueRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall<\Proto\Parameters\ParameterValueProto>
     */
    public function GetParameterValue(\Proto\Parameters\GetParameterValueRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterValueService/GetParameterValue',
        $argument,
        ['\Proto\Parameters\ParameterValueProto', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\DeleteParameterValueRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall<\Google\Protobuf\GPBEmpty>
     */
    public function DeleteParameterValue(\Proto\Parameters\DeleteParameterValueRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterValueService/DeleteParameterValue',
        $argument,
        ['\Google\Protobuf\GPBEmpty', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\ListParameterValuesRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall<\Proto\Parameters\ListParameterValuesResponse>
     */
    public function ListParameterValues(\Proto\Parameters\ListParameterValuesRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterValueService/ListParameterValues',
        $argument,
        ['\Proto\Parameters\ListParameterValuesResponse', 'decode'],
        $metadata, $options);
    }

}
