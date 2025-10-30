<?php

declare(strict_types=1);

namespace App\GrpcConverters;

use Proto\Parameters\ParameterValueProto;

class ParameterValueProtoConvertor
{
    /**
     * @return array{
     *     id: int|string,
     *     parameter_value: string,
     *     parameter_code: string,
     *     attribute1_value: string,
     *     attribute2_value: string,
     *     attribute3_value: string,
     *     attribute4_value: string,
     *     attribute5_value: string,
     *     is_active: bool,
     *     sort_priority: int,
     *     notes: string,
     * }|null
     */
    public static function convertToArray(?ParameterValueProto $parameterValue): ?array
    {
        if ($parameterValue === null) {
            return null;
        }

        return [
            'id' => $parameterValue->getId(),
            'parameter_value' => $parameterValue->getParameterValue(),
            'parameter_code' => $parameterValue->getParameterCode(),
            'attribute1_value' => $parameterValue->getAttribute1Value(),
            'attribute2_value' => $parameterValue->getAttribute2Value(),
            'attribute3_value' => $parameterValue->getAttribute3Value(),
            'attribute4_value' => $parameterValue->getAttribute4Value(),
            'attribute5_value' => $parameterValue->getAttribute5Value(),
            'is_active' => $parameterValue->getIsActive(),
            'sort_priority' => $parameterValue->getSortPriority(),
            'notes' => $parameterValue->getNotes(),
        ];
    }
}
