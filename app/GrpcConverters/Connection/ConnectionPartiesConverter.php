<?php

namespace App\GrpcConverters\Connection;

use App\Services\Parties\PartyService;
use Proto\Consumers\PartiesConnectionRelMessage;

class ConnectionPartiesConverter
{
    /**
     * Convert ConnectionMessage proto to array.
     *
     * @return array{
     *    version_id: int,
     *    party_id: int,
     *    connection_id: int,
     *    effective_start: \DateTime | null,
     *    effective_end: \DateTime | null,
     *    is_active: bool,
     *    created_by: int,
     *    updated_by: int,
     *    deleted_ts: \DateTime | null,
     *    deleted_by: int,
     *    party: array
     * } | null
     */
    public static function convertToArray(?PartiesConnectionRelMessage $message): ?array
    {
        if ($message === null) {
            return null;
        }
        $party = $message->getParty();
        $partyService = new PartyService;
        $partyArray = $partyService->transformPartyToArray($party);

        return [
            'version_id' => $message->getVersionId(),
            'party_id' => $message->getPartyId(),
            'connection_id' => $message->getConnectionId(),
            'effective_start' => $message->getEffectiveStart() ? $message->getEffectiveStart()->toDateTime() : null,
            'effective_end' => $message->getEffectiveEnd() ? $message->getEffectiveEnd()->toDateTime() : null,
            'is_active' => $message->getIsActive(),
            'created_by' => $message->getCreatedBy(),
            'updated_by' => $message->getUpdatedBy(),
            'deleted_ts' => $message->getDeletedTs() ? $message->getDeletedTs()->toDateTime() : null,
            'deleted_by' => $message->getDeletedBy(),
            'party' => $partyArray,
        ];
    }
}
