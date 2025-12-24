<?php

namespace App\GrpcConverters\Connection;

use App\GrpcConverters\ParameterValueProtoConvertor;
use Proto\Connections\ConnectionGenerationTypeMessage;

class ConnectionGenerationProtoConverter
{
    /**
     * Convert ConnectionGenerationTypeMessage proto to array.
     */
    public static function convertToArray(?ConnectionGenerationTypeMessage $generationType): ?array
    {
        if ($generationType === null) {
            return null;
        }

        return [
            'id' => $generationType->getId(),
            'connection_id' => $generationType->getConnectionId(),
            'generation_type_id' => $generationType->getGenerationTypeId(),
            'effective_start' => $generationType->getEffectiveStart()
                ? $generationType->getEffectiveStart()->toDateTime()->format('Y-m-d')
                : null,
            'effective_end' => $generationType->getEffectiveEnd()
                ? $generationType->getEffectiveEnd()->toDateTime()->format('Y-m-d')
                : null,
            'is_current' => $generationType->getIsCurrent(),
            'created_at' => $generationType->getCreatedAt()
                ? $generationType->getCreatedAt()->toDateTime()->format('Y-m-d H:i:s')
                : null,
            'updated_at' => $generationType->getUpdatedAt()
                ? $generationType->getUpdatedAt()->toDateTime()->format('Y-m-d H:i:s')
                : null,
            'created_by' => $generationType->getCreatedBy() ?: null,
            'updated_by' => $generationType->getUpdatedBy() ?: null,

            // Parameter value expansion
            'generation_type' => ParameterValueProtoConvertor::convertToArray(
                $generationType->getGenerationType()
            ),
        ];
    }
}
