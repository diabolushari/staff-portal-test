<?php
// GENERATED CODE -- DO NOT EDIT!

namespace Proto\Consumers;

/**
 * ------------ SERVICE ------------
 *
 */
class OfficeServiceClient extends \Grpc\BaseStub {

    /**
     * @param string $hostname hostname
     * @param array $opts channel options
     * @param \Grpc\Channel $channel (optional) re-use channel object
     */
    public function __construct($hostname, $opts, $channel = null) {
        parent::__construct($hostname, $opts, $channel);
    }

    /**
     * @param \Proto\Consumers\OfficeCreateRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function CreateOffice(\Proto\Consumers\OfficeCreateRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OfficeService/CreateOffice',
        $argument,
        ['\Proto\Consumers\OfficeResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\OfficeIdRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function GetOfficeById(\Proto\Consumers\OfficeIdRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OfficeService/GetOfficeById',
        $argument,
        ['\Proto\Consumers\OfficeResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\OfficeListRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function ListOffices(\Proto\Consumers\OfficeListRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OfficeService/ListOffices',
        $argument,
        ['\Proto\Consumers\OfficeListResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\OfficeUpdateRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function UpdateOffice(\Proto\Consumers\OfficeUpdateRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OfficeService/UpdateOffice',
        $argument,
        ['\Proto\Consumers\OfficeResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \Proto\Consumers\OfficeIdRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     * @return \Grpc\UnaryCall
     */
    public function DeleteOffice(\Proto\Consumers\OfficeIdRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/com.kseb.consumerservice.grpc.consumers.OfficeService/DeleteOffice',
        $argument,
        ['\Google\Protobuf\GPBEmpty', 'decode'],
        $metadata, $options);
    }

}
