<?php

namespace App\GrpcConverters\SecurityDeposit;

use App\GrpcConverters\Connection\ConnectionProtoConverter;
use App\GrpcConverters\ParameterValueProtoConvertor;
use App\Http\Requests\SecurityDeposit\SdDemandFormRequest;
use Proto\Consumers\CreateSdDemandRequest;
use Proto\Consumers\SdDemandMessage;

class SdDemandConverter
{
    /**
     * Convert ConnectionGreenEnergyMessage proto to array.
     */
    public static function convertToArray(?SdDemandMessage $sdDemand): ?array
    {
        if ($sdDemand === null) {
            return null;
        }

        return [
            'sd_demand_id' => $sdDemand->getSdDemandId(),
            'connection_id' => $sdDemand->getConnectionId(),
            'connection' => $sdDemand->hasConnection() ?  ConnectionProtoConverter::convertToArray($sdDemand->getConnection()) : null,
            'demand_type_id' => $sdDemand->getDemandTypeId(),
            'demand_type' => $sdDemand->hasDemandType() ? ParameterValueProtoConvertor::convertToArray($sdDemand->getDemandType()) : null,
            'total_sd_amount' => $sdDemand->getTotalSdAmount(),
            'calculation_basic_id' => $sdDemand->hasCalculationBasic() ? $sdDemand->getCalculationBasicId() : null,
            'calculation_basic' => $sdDemand->hasCalculationBasic() ? ParameterValueProtoConvertor::convertToArray($sdDemand->getCalculationBasic()) : null,
            'calculation_period_from' => $sdDemand->getCalculationPeriodFrom(),
            'calculation_period_to' => $sdDemand->getCalculationPeriodTo(),
            'applicable_from' => $sdDemand->getApplicableFrom(),
            'applicable_to' => $sdDemand->hasApplicableTo() ? $sdDemand->getApplicableTo() : null,
            'status_id' => $sdDemand->getStatusId(),
            'status' => $sdDemand->hasStatus() ? ParameterValueProtoConvertor::convertToArray($sdDemand->getStatus()) : null,
            'is_active' => $sdDemand->getIsActive(),
            'created_by' => $sdDemand->getCreatedBy(),
            'updated_by' => $sdDemand->getUpdatedBy(),
        ];
    }

    public function formToGrpcMessage(SdDemandFormRequest $request): SdDemandMessage
    {
        $msg = new SdDemandMessage;

        $msg->setConnectionId($request->connectionId);
        $msg->setDemandTypeId($request->demandTypeId);
        if ($request->calculationBasicId != null) {
            $msg->setCalculationBasicId($request->calculationBasicId);
        }
        $msg->setTotalSdAmount($request->totalSdAmount);
        $msg->setCalculationPeriodFrom($request->calculationPeriodFrom);
        $msg->setCalculationPeriodTo($request->calculationPeriodTo);
        $msg->setApplicableFrom($request->applicableFrom);
        if ($request->applicableTo != null) {
            $msg->setApplicableTo($request->applicableTo);
        }
        $msg->setStatusId($request->statusId);
        $msg->setIsActive($request->isActive);
        return $msg;
    }
}
