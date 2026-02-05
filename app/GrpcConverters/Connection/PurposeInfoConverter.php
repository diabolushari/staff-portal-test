<?php

namespace App\GrpcConverters\Connection;

use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\Connections\PurposeInfoFormRequest;
use Proto\Connections\PurposeInfoFormMessage;
use Proto\Connections\PurposeInfoMessage;

class PurposeInfoConverter
{


    public static function toArray(?PurposeInfoMessage $purposeInfoMessage): array|null
    {
        if ($purposeInfoMessage == null) {
            return null;
        }
        return [
            'id' => $purposeInfoMessage->getId(),
            'purpose_id' => $purposeInfoMessage->getPurposeId(),
            'tariff_id' => $purposeInfoMessage->getTariffId(),
            'is_non_dps' => $purposeInfoMessage->getIsNonDps(),
            'is_active' => $purposeInfoMessage->getIsActive(),
            'effective_start' => $purposeInfoMessage->getEffectiveStart(),
            'effective_end' => $purposeInfoMessage->getEffectiveEnd(),
            'created_by' => $purposeInfoMessage->getCreatedBy(),
            'updated_by' => $purposeInfoMessage->getUpdatedBy(),
            'deleted_by' => $purposeInfoMessage->getDeletedBy(),
            'created_ts' => $purposeInfoMessage->getCreatedTs(),
            'updated_ts' => $purposeInfoMessage->getUpdatedTs(),
            'deleted_ts' => $purposeInfoMessage->getDeletedTs(),
            'purpose' => ParameterValueProtoConvertor::convertToArray($purposeInfoMessage->getPurpose()),
            'tariff' => ParameterValueProtoConvertor::convertToArray($purposeInfoMessage->getTariff()),
            'tariff_name' => ParameterValueProtoConvertor::convertToArray($purposeInfoMessage->getTariff())['parameter_value'] ?? null
        ];
    }

    public static function toProto(PurposeInfoFormRequest $request): PurposeInfoFormMessage
    {
        $purposeInfoFormMessage = new PurposeInfoFormMessage();
        if ($request->id) {
            $purposeInfoFormMessage->setId($request->id);
        }
        $purposeInfoFormMessage->setPurposeId($request->purposeId);
        $purposeInfoFormMessage->setTariffId($request->tariffId);
        $purposeInfoFormMessage->setIsNonDps($request->isNonDps);
        $purposeInfoFormMessage->setEffectiveStart($request->effectiveStart);
        if ($request->effectiveEnd) {
            $purposeInfoFormMessage->setEffectiveEnd($request->effectiveEnd);
        }
        return $purposeInfoFormMessage;
    }
}
