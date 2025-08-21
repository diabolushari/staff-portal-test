<?php
// GENERATED CODE -- DO NOT EDIT!

namespace Proto\Modules;

/**
 * ----- Service Definition -----
 *
 */
class SystemModuleServiceClient extends \Grpc\BaseStub {

    /**
     * @param string $hostname hostname
     * @param array $opts channel options
     * @param \Grpc\Channel $channel (optional) re-use channel object
     */
    public function __construct($hostname, $opts, $channel = null) {
        parent::__construct($hostname, $opts, $channel);
    }

    /**
     * @param \Proto\Modules\CreateSystemModuleRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall<\Proto\Modules\SystemModule>
     */
    public function CreateSystemModule(\Proto\Modules\CreateSystemModuleRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.modules.SystemModuleService/CreateSystemModule',
        $argument,
        ['\Proto\Modules\SystemModule', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Modules\GetSystemModuleRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall<\Proto\Modules\SystemModule>
     */
    public function GetSystemModule(\Proto\Modules\GetSystemModuleRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.modules.SystemModuleService/GetSystemModule',
        $argument,
        ['\Proto\Modules\SystemModule', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Modules\UpdateSystemModuleRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall<\Proto\Modules\SystemModule>
     */
    public function UpdateSystemModule(\Proto\Modules\UpdateSystemModuleRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.modules.SystemModuleService/UpdateSystemModule',
        $argument,
        ['\Proto\Modules\SystemModule', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Modules\DeleteSystemModuleRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall<\Google\Protobuf\GPBEmpty>
     */
    public function DeleteSystemModule(\Proto\Modules\DeleteSystemModuleRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.modules.SystemModuleService/DeleteSystemModule',
        $argument,
        ['\Google\Protobuf\GPBEmpty', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Modules\ListSystemModulesRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall<\Proto\Modules\ListSystemModulesResponse>
     */
    public function ListSystemModules(\Proto\Modules\ListSystemModulesRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.proto.modules.SystemModuleService/ListSystemModules',
        $argument,
        ['\Proto\Modules\ListSystemModulesResponse', 'decode'],
        $metadata, $options);
    }

}
