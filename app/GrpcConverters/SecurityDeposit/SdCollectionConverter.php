<?php

namespace App\GrpcConverters\SecurityDeposit;

use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\SecurityDeposit\SdCollectionMessage;

class SdCollectionConverter
{
    /**
     * Convert ConnectionGreenEnergyMessage proto to array.
     */
    public static function convertTOArray(?SdCollectionMessage $sdCollection): ?array
    {
        if ($sdCollection === null) {
            return null;
        }

        return [
            'sd_collection_id' => $sdCollection->getSdCollectionId(),
            'sd_demand_id' => $sdCollection->getSdDemandId(),
            'collection_date' => $sdCollection->getCollectionDate(),
            'collection_mode_id' => $sdCollection->getCollectionModeId(),
            'collection_amount' => $sdCollection->getCollectionAmount(),
            'receipt_number' => $sdCollection->hasReceiptNumber() ? $sdCollection->getReceiptNumber() : null,
            'collected_at' => $sdCollection->hasCollectedAt() ? $sdCollection->getCollectedAt() : null,
            'collected_by' => $sdCollection->hasCollectedBy() ? $sdCollection->getCollectedBy() : null,
            'is_active' => $sdCollection->getIsActive(),
            'reversal_reason' => $sdCollection->hasReversalReason() ? $sdCollection->getReversalReason() : null,
            'reversal_date' => $sdCollection->hasReversalDate() ? $sdCollection->getReversalReason : null,
            'reversed_by' => $sdCollection->hasReversedBy() ? $sdCollection->getReversedBy() : null,
            'collection_mode' => $sdCollection->hasCollectionMode() ?
                ParameterValueProtoConvertor::convertToArray($sdCollection->getCollectionMode()) :
                null
        ];
    }
}
