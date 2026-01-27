<?php

namespace App\GrpcConverters\Connection;

use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\Connections\ConnectionGreenEnergyFormRequest;
use App\Services\utils\DateTimeConverter;
use Proto\Consumers\CreateGreenEnergyMessage;
use Proto\Consumers\GreenEnergyMessage;

class ConnectionGreenEnergyConverter
{
    /**
     * Convert ConnectionGreenEnergyMessage proto to array.
     */
    public static function convertToArray(?GreenEnergyMessage $greenEnergy): ?array
    {
        if ($greenEnergy === null) {
            return null;
        }

        return [
            'id' => $greenEnergy->getId(),
            'connection_id' => $greenEnergy->getConnectionId(),
            'green_energy_type_id' => $greenEnergy->getGreenEnergyTypeId(),
            'green_energy_type' => ParameterValueProtoConvertor::convertToArray($greenEnergy->getGreenEnergyType()),
            'percentage' => $greenEnergy->getPercentage(),
            'remarks' => $greenEnergy->getRemarks(),
            'is_active' => $greenEnergy->getIsActive(),
            'effective_start' => $greenEnergy->getEffectiveStartTs()
                ? \Carbon\Carbon::createFromTimestamp($greenEnergy->getEffectiveStartTs())->format('Y-m-d')
                : null,
            'effective_end' => $greenEnergy->getEffectiveEndTs()
                ? \Carbon\Carbon::createFromTimestamp($greenEnergy->getEffectiveEndTs())->format('Y-m-d')
                : null,
            'created_by' => $greenEnergy->getCreatedBy() ?: null,
            'updated_by' => $greenEnergy->getUpdatedBy() ?: null,
        ];
    }

    public function formToGrpcMessage(ConnectionGreenEnergyFormRequest $request): CreateGreenEnergyMessage
    {
        $msg = new CreateGreenEnergyMessage();
        $msg->setConnectionId($request->connectionId);
        $msg->setGreenEnergyTypeId($request->greenEnergyTypeId);
        $msg->setPercentage($request->percentage);
        $effectiveStart = DateTimeConverter::convertStringToTimestamp($request->effectiveStart);
        $msg->setEffectiveStartTs($effectiveStart);

        if ($request->effectiveEnd !== null) {
            $effectiveEnd = DateTimeConverter::convertStringToTimestamp($request->effectiveEnd);
            $msg->setEffectiveEndTs($effectiveEnd);
        }
        if ($request->remarks) {
            $msg->setRemarks($request->remarks);
        }

        if ($request->isActive) {
            $msg->setIsActive($request->isActive);
        }


        return $msg;
    }
}
