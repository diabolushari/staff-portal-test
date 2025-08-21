<?php
// GENERATED CODE -- DO NOT EDIT!

namespace Proto\Parameters;

/**
 * ------------ SERVICE ------------
 */
class ParameterDefinitionServiceClient extends \Grpc\BaseStub {

    /**
     * @param string $hostname hostname
     * @param array $opts channel options
     * @param \Grpc\Channel $channel (optional) re-use channel object
     */
    public function __construct($hostname, $opts, $channel = null) {
        parent::__construct($hostname, $opts, $channel);
    }

    /**
     * @param \Proto\Parameters\CreateParameterDefinitionRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function CreateParameterDefinition(\Proto\Parameters\CreateParameterDefinitionRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterDefinitionService/CreateParameterDefinition',
        $argument,
        ['\Proto\Parameters\ParameterDefinitionProto', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\GetParameterDefinitionRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function GetParameterDefinition(\Proto\Parameters\GetParameterDefinitionRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterDefinitionService/GetParameterDefinition',
        $argument,
        ['\Proto\Parameters\ParameterDefinitionProto', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\UpdateParameterDefinitionRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function UpdateParameterDefinition(\Proto\Parameters\UpdateParameterDefinitionRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterDefinitionService/UpdateParameterDefinition',
        $argument,
        ['\Proto\Parameters\ParameterDefinitionProto', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\DeleteParameterDefinitionRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function DeleteParameterDefinition(\Proto\Parameters\DeleteParameterDefinitionRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterDefinitionService/DeleteParameterDefinition',
        $argument,
        ['\Google\Protobuf\GPBEmpty', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Parameters\ListParameterDefinitionsRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function ListParameterDefinitions(\Proto\Parameters\ListParameterDefinitionsRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.parameters.ParameterDefinitionService/ListParameterDefinitions',
        $argument,
        ['\Proto\Parameters\ListParameterDefinitionsResponse', 'decode'],
        $metadata, $options);
    }

}
