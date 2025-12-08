<?php

namespace App\GrpcConverters\Billing;

use App\GrpcConverters\Connection\ConnectionProtoConverter;
use App\Services\Connection\ConsumerService;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\StructConverter;
use Proto\Bill\BillMessage;

class BillProtoConverter
{
    public static function convertToArray(BillMessage $bill)
    {

        $chargeHeads = $bill->getChargeHeads();
        if($chargeHeads != null){
            $list = [];
            foreach($chargeHeads as $chargeHead){
                $list[] = StructConverter::convert($chargeHead);
            }
            $chargeHeads = $list;
        }
        $computedProperties = $bill->getComputedProperties();
        if($computedProperties != null){
            $list = [];
            foreach($computedProperties as $computedProperty){
                $list[] = StructConverter::convert($computedProperty);
            }
            $computedProperties = $list;
        }
        $connection = $bill->getConnection();
        if($connection != null){
            $connection = ConnectionProtoConverter::convertToArray($connection);
        }
        $consumer = $bill->getConsumer();
        if($consumer != null){
            $consumerProtoConverter = app(ConsumerService::class);
            $consumer = $consumerProtoConverter->transformConsumerToArray($consumer);
        }

        return [
            'bill_id' => $bill->getBillId(),
            'connection_id' => $bill->getConnectionId(),
            'reading_year_month' => $bill->getReadingYearMonth(),
            'bill_year_month' => $bill->getBillYearMonth(),
            'bill_date' => $bill->getBillDate() ? DateTimeConverter::convertTimestampToString($bill->getBillDate()) : null,
            'due_date' => $bill->getDueDate() ? DateTimeConverter::convertTimestampToString($bill->getDueDate()) : null,
            'dc_date' => $bill->getDcDate() ? DateTimeConverter::convertTimestampToString($bill->getDcDate()) : null,
            'bill_amount' => $bill->getBillAmount(),
            'charge_heads' => $chargeHeads,
            'computed_properties' => $computedProperties,
            'remarks' => $bill->getRemarks(),
            'created_ts' => $bill->getCreatedTs(),
            'created_by' => $bill->getCreatedBy(),
            'deleted_ts' => $bill->getDeletedTs(),
            'deleted_by' => $bill->getDeletedBy(),
            'connection' => $connection,
            'consumer' => $consumer,
        ];
    }

    public static function convertToBill(BillMessage $bill)
    {
        return [
            'bill_id' => $bill->getBillId(),
            'connection_id' => $bill->getConnectionId(),
            'reading_year_month' => $bill->getReadingYearMonth(),
            'bill_year_month' => $bill->getBillYearMonth(),
            'bill_date' => $bill->getBillDate() ? DateTimeConverter::convertTimestampToString($bill->getBillDate()) : null,
            'due_date' => $bill->getDueDate() ? DateTimeConverter::convertTimestampToString($bill->getDueDate()) : null,
            'dc_date' => $bill->getDcDate() ? DateTimeConverter::convertTimestampToString($bill->getDcDate()) : null,
            'bill_amount' => $bill->getBillAmount(),
            'charge_heads' => $bill->getChargeHeads(),
            'computed_properties' => $bill->getComputedProperties(),
            'remarks' => $bill->getRemarks(),
            'created_ts' => $bill->getCreatedTs(),
            'created_by' => $bill->getCreatedBy(),
            'deleted_ts' => $bill->getDeletedTs(),
            'deleted_by' => $bill->getDeletedBy(),
        ];
    }
}