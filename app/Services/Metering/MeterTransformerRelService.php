<?php

namespace App\Services\Metering;

use App\Http\Requests\Metering\MeterTransformerRelFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Carbon\Carbon;
use Grpc\ChannelCredentials;
use Proto\Metering\MeterTransformerRelServiceClient;
use Proto\Metering\CreateMeterTransformerRelRequest;
use Proto\Metering\UpdateMeterTransformerRelRequest;
use Proto\Metering\GetMeterTransformerRelRequest;
use Proto\Metering\DeleteMeterTransformerRelRequest;
use Proto\Metering\ListMeterTransformerRelsRequest;
use Proto\Metering\MeterTransformerRelMessage;
use Google\Protobuf\Timestamp;


class MeterTransformerRelService
{
    private MeterTransformerRelServiceClient $client;

    public function __construct()
    {
        $this->client = new MeterTransformerRelServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

     private function toProtoTimestamp(?string $date): ?Timestamp
    {
        if (empty($date)) {
            return null;
        }

        $ts = new Timestamp();
        $dt = Carbon::parse($date);
        $ts->fromDateTime($dt);
        return $ts;
    }

    public function listRelations(): GrpcServiceResponse
    {
        $request = new ListMeterTransformerRelsRequest();
        [$response, $status] = $this->client->ListMeterTransformerRels($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
            dd(GrpcErrorService::handleErrorResponse($status));
        }

        $relsArray = [];
        foreach ($response->getRels() as $rel) {
            $relsArray[] = self::relProtoToArray($rel);
        }

        return GrpcServiceResponse::success($relsArray, $response, $status->code, $status->details);
    }

    public function createRelation(array $data): GrpcServiceResponse
    {
        $request = new CreateMeterTransformerRelRequest();
        $request->setCtptId($data['ctpt_id']);
        $request->setMeterId($data['meter_id']);
       if (!empty($data['faulty_date'])) {
            $request->setFaultyDate($this->toProtoTimestamp($data['faulty_date']));
        }
        if (!empty($data['ctpt_energise_date'])) {
            $request->setCtptEnergiseDate($this->toProtoTimestamp($data['ctpt_energise_date']));
        }
        if (!empty($data['ctpt_change_date'])) {
            $request->setCtptChangeDate($this->toProtoTimestamp($data['ctpt_change_date']));
        }
        
        $request->setStatusId($data['status_id']);
        $request->setChangeReasonId($data['change_reason_id']);
        //$request->setEffectiveStartTs(Carbon::parse($data['effective_start_ts'])->toProto());
        $request->setCreatedBy($data['created_by']);
        $request->setIsActive($data['is_active'] ?? true);

        [$response, $status] = $this->client->CreateMeterTransformerRel($request)->wait();

        if ($status->code !== 0) {
           return GrpcServiceResponse::error(
            GrpcErrorService::handleErrorResponse($status),
            $response,
            $status->code,
            $status->details
        );


        }

        return GrpcServiceResponse::success(
            self::relProtoToArray($response->getRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function getRelation(int $id): GrpcServiceResponse
    {
        $request = new GetMeterTransformerRelRequest();
        $request->setVersionId($id);

        [$response, $status] = $this->client->GetMeterTransformerRelById($request)->wait();
        //dd($response, $status);
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            self::relProtoToArray($response->getRel()),
            $response,
            $status->code,
            $status->details
        );
    }

    public function updateRelation(array $data): GrpcServiceResponse
    {
        $request = new UpdateMeterTransformerRelRequest();
        $request->setVersionId($data['version_id']);
        $request->setCtptId($data['ctpt_id']);
        $request->setMeterId($data['meter_id']);
        if (!empty($data['faulty_date'])) {
            $request->setFaultyDate(Carbon::parse($data['faulty_date'])->toProto());
        }
        if (!empty($data['ctpt_energise_date'])) {
            $request->setCtptEnergiseDate(Carbon::parse($data['ctpt_energise_date'])->toProto());
        }
        if (!empty($data['ctpt_change_date'])) {
            $request->setCtptChangeDate(Carbon::parse($data['ctpt_change_date'])->toProto());
        }
        $request->setStatusId($data['status_id']);
        $request->setChangeReasonId($data['change_reason_id']);
       // $request->setEffectiveStartTs(Carbon::parse($data['effective_start_ts'])->toProto());
        $request->setUpdatedBy($data['updated_by']);
        $request->setIsActive($data['is_active'] ?? true);

        [$response, $status] = $this->client->UpdateMeterTransformerRel($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(
            self::relProtoToArray($response->getRel()),
            $response,
            $status->code,
            $status->details
        );
    }
    

    public function deleteRelation(int $id): GrpcServiceResponse
    {
        $request = new DeleteMeterTransformerRelRequest();
        $request->setVersionId($id);

        [$response, $status] = $this->client->DeleteMeterTransformerRel($request)->wait();
        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success(null, $response, $status->code, $status->details);
    }

    /**
     * Convert MeterTransformerRelMessage to array
     */
    public static function relProtoToArray(MeterTransformerRelMessage $rel): array
    {
        return [
            'version_id' => $rel->getVersionId(),
            'ctpt_id' => $rel->getCtptId(),
            'meter_id' => $rel->getMeterId(),
            'faulty_date' => $rel->hasFaultyDate() ? $rel->getFaultyDate()->toDateTime()->format('Y-m-d') : null,
            'ctpt_energise_date' => $rel->hasCtptEnergiseDate() ? $rel->getCtptEnergiseDate()->toDateTime()->format('Y-m-d') : null,
            'ctpt_change_date' => $rel->hasCtptChangeDate() ? $rel->getCtptChangeDate()->toDateTime()->format('Y-m-d') : null,
            'status_id' => $rel->getStatusId(),
            'change_reason_id' => $rel->getChangeReasonId(),
        //     'ctpt' => [
        //     'id' => $rel->getCtpt()?->getMeterCtptId(),
        //     'mergedValue' => sprintf(
        //         '#%s - %s - %s',
        //         $rel->getCtpt()?->getMeterCtptId(),
        //         $rel->getCtpt()?->getType()->getParameterValue(),
        //         $rel->getCtpt()?->getCtRatio() ?: $rel->getCtpt()?->getPtRatio()
        //     ),
        // ],
        // 'meter' => [
        //     'id' => $rel->getMeter()?->getMeterId(),
        //     'serial' => $rel->getMeter()?->getMeterSerial(),
        // ],
        // 'status' => [
        //     'id' => $rel->getStatusId(),
        //     'label' => $rel->getStatus()?->getParameterValue(),
        // ],
        // 'change_reason' => [
        //     'id' => $rel->getChangeReasonId(),
        //     'label' => $rel->getChangeReason()?->getParameterValue(),
        // ],
            'effective_start_ts' => $rel->getEffectiveStartTs()->toDateTime()->format('Y-m-d'),
            'effective_end_ts' => $rel->hasEffectiveEndTs() ? $rel->getEffectiveEndTs()->toDateTime()->format('Y-m-d') : null,
            'created_ts' => $rel->hasCreatedTs() ? $rel->getCreatedTs()->toDateTime()->format('Y-m-d') : null,
            'updated_ts' => $rel->hasUpdatedTs() ? $rel->getUpdatedTs()->toDateTime()->format('Y-m-d') : null,
            'created_by' => $rel->getCreatedBy(),
            'updated_by' => $rel->getUpdatedBy(),
            'is_active' => $rel->getIsActive(),
        ];
    }
}
