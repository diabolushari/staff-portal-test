<?php

declare(strict_types=1);

namespace App\GrpcConverters\BillingGroup;

use Proto\BillingGroup\BillingGroupMessage;

class BillingGroupProtoConvertor
{
    /**
     * Convert BillingGroupMessage proto to array.
     *
     * @return array{
     *     version_id: int,
     *     billing_group_id: int,
     *     name: string,
     *     description: string|null,
     *     effective_start: string|null,
     *     effective_end: string|null,
     *     is_active: bool,
     *     created_by: int,
     *     updated_by: int,
     *     deleted_ts: string|null,
     *     deleted_by: int,
     *     connections: array|null
     * }|null
     */
    public static function convertToArray(?BillingGroupMessage $g): ?array
    {
        if ($g === null) {
            return null;
        }

        $effectiveStart = $g->getEffectiveStart()
            ? $g->getEffectiveStart()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        $effectiveEnd = ($g->hasEffectiveEnd() && $g->getEffectiveEnd())
            ? $g->getEffectiveEnd()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        $deletedTs = $g->getDeletedTs()
            ? $g->getDeletedTs()->toDateTime()->format('Y-m-d H:i:s')
            : null;

        $connections = [];
        foreach ($g->getBillingGroupConnectionsList() as $conn) {
            $connections[] = [
                'billing_group_connection_rel_id' => $conn->getBillingGroupConnectionRelId(),
                'connection_id'                    => $conn->getConnectionId(),
                'consumer_number'                  => $conn->getConsumerNumber(),
                'consumer_name'                    => $conn->getConsumerName(),
                'connection_type'                  => $conn->getConnectionType(),
                'purpose'                          => $conn->getPurpose(),
                'bill_amount'                      => $conn->getBillAmount(),
                'bill_date'                        => $conn->getBillDate(),
                'active_from'                      => $conn->getActiveFrom(),
                'active_till'                      => $conn->getActiveTill(),
            ];
        }

        return [
            'version_id'       => $g->getVersionId(),
            'billing_group_id' => $g->getBillingGroupId(),
            'name'             => $g->getName(),
            'description'      => $g->hasDescription() ? $g->getDescription() : null,

            'effective_start'  => $effectiveStart,
            'effective_end'    => $effectiveEnd,

            'is_active'        => $g->getIsActive(),

            'created_by'       => $g->getCreatedBy(),
            'updated_by'       => $g->getUpdatedBy(),

            'deleted_ts'       => $deletedTs,
            'deleted_by'       => $g->getDeletedBy(),
            'connections'      => $connections,
        ];
    }
}
