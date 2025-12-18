<?php

namespace App\GrpcConverters\Billing;

use App\GrpcConverters\Connection\ConnectionProtoConverter;
use App\Services\utils\DateTimeConverter;
use Proto\Bill\BillJobGenerationStatusMessage;

class BillJobGenerationStatusGrpcConverter
{
    public static function convertToArray(BillJobGenerationStatusMessage $billJobGenerationStatus)
    {
        return [
            'bill_job_generation_status_id' => $billJobGenerationStatus->getBillJobGenerationStatusId(),
            'connection_id' => $billJobGenerationStatus->getConnectionId(),
            'reading_year_month' => $billJobGenerationStatus->getReadingYearMonth(),
            'bill_year_month' => $billJobGenerationStatus->getBillYearMonth(),
            'bill_date' => $billJobGenerationStatus->getBillDate() ? DateTimeConverter::convertTimestampToString($billJobGenerationStatus->getBillDate()) : null,
            'due_date' => $billJobGenerationStatus->getDueDate() ? DateTimeConverter::convertTimestampToString($billJobGenerationStatus->getDueDate()) : null,
            'dc_date' => $billJobGenerationStatus->getDcDate() ? DateTimeConverter::convertTimestampToString($billJobGenerationStatus->getDcDate()) : null,
            'exception' => $billJobGenerationStatus->getException(),
            'initialized_date' => $billJobGenerationStatus->getInitializedDate() ? DateTimeConverter::convertTimestampToString($billJobGenerationStatus->getInitializedDate()) : null,
            'connection' => $billJobGenerationStatus->getConnection() ? ConnectionProtoConverter::convertToArray($billJobGenerationStatus->getConnection()) : null,
        ];
    }
}
