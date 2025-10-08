<?php

namespace App\Services\Metering;

use App\Http\Requests\Metering\MeterTransformerRelFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Carbon\Carbon;
use Google\Protobuf\GPBEmpty;
use Google\Protobuf\Timestamp;
use Grpc\ChannelCredentials;
use Proto\Metering\GetMeterTransformerRelByCtptIdRequest;
use Proto\Metering\GetMeterTransformerRelByMeterIdRequest;
use Proto\Metering\MeterTransformerRelCreateRequest;
use Proto\Metering\MeterTransformerRelIdRequest;
use Proto\Metering\MeterTransformerRelMessage;
use Proto\Metering\MeterTransformerRelServiceClient;
use Proto\Metering\MeterTransformerRelUpdateRequest;

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

        $ts = new Timestamp;
        $dt = Carbon::parse($date);
        $ts->fromDateTime($dt);

        return $ts;
    }

    public function listRelations(): GrpcServiceResponse
    {
        $request = new GPBEmpty;
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

    public function createRelation(MeterTransformerRelFormRequest $data): GrpcServiceResponse
    {
        $request = new MeterTransformerRelCreateRequest;
        $request->setCtptId($data->ctptId);
        $request->setMeterId($data->meterId);
        if ($data->faultyDate) {
            $request->setFaultyDate($this->toProtoTimestamp($data->faultyDate));
        }
        if ($data->ctptEnergiseDate) {
            $request->setCtptEnergiseDate($this->toProtoTimestamp($data->ctptEnergiseDate));
        }
        if ($data->ctptChangeDate) {
            $request->setCtptChangeDate($this->toProtoTimestamp($data->ctptChangeDate));
        }

        $request->setStatusId($data->statusId);

        $request->setChangeReasonId($data->changeReasonId);
        $request->setCreatedBy(1);
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
        $request = new MeterTransformerRelIdRequest;
        $request->setVersionId($id);

        [$response, $status] = $this->client->GetMeterTransformerRelById($request)->wait();
        // dd($response, $status);
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

    public function getRelByMeterId(int $meterId): GrpcServiceResponse
    {
        $request = new GetMeterTransformerRelByMeterIdRequest;
        $request->setMeterId($meterId);

        [$response, $status] = $this->client->GetMeterTransformerRelByMeterId($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status, $response, false),
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

    public function getRelByCtptId(int $ctptId): GrpcServiceResponse
    {
        $request = new GetMeterTransformerRelByCtptIdRequest;
        $request->setCtptId($ctptId);

        [$response, $status] = $this->client->GetMeterTransformerRelByCtptId($request)->wait();

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

    public function updateRelation(array $data, $id): GrpcServiceResponse
    {
        $request = new MeterTransformerRelUpdateRequest;
        $request->setVersionId($id);

        $request->setCtptId($data['ctpt_id']);
        $request->setMeterId($data['meter_id']);

        if (! empty($data['faulty_date'])) {
            $request->setFaultyDate($this->toProtoTimestamp($data['faulty_date']));
        }
        if (! empty($data['ctpt_energise_date'])) {
            $request->setCtptEnergiseDate($this->toProtoTimestamp($data['ctpt_energise_date']));
        }
        if (! empty($data['ctpt_change_date'])) {
            $request->setCtptChangeDate($this->toProtoTimestamp($data['ctpt_change_date']));
        }
        $request->setStatusId($data['status_id']);
        $request->setChangeReasonId($data['change_reason_id']);
        $request->setUpdatedBy($data['updated_by'] ?? auth()->id());

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
        $request = new MeterTransformerRelIdRequest;
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
        $ctpt = $rel->getCtpt();
        $ctptType = null;
        if ($ctpt && method_exists($ctpt, 'getType') && $ctpt->getType()) {
            $ctptType = $ctpt->getType()->getParameterValue();
        }

        $ctRatio = ($ctpt && method_exists($ctpt, 'getCtRatio')) ? $ctpt->getCtRatio() : null;
        $ptRatio = ($ctpt && method_exists($ctpt, 'getPtRatio')) ? $ctpt->getPtRatio() : null;
        $ratio = $ctRatio ?: $ptRatio;

        return [
            'version_id' => $rel->getVersionId(),
            'ctpt_id' => $rel->getCtptId(),
            'meter_id' => $rel->getMeterId(),
            'meter_serial' => ($rel->getMeter() && method_exists($rel->getMeter(), 'getMeterSerial'))
            ? $rel->getMeter()->getMeterSerial()
            : null,
            'faulty_date' => $rel->hasFaultyDate() ? $rel->getFaultyDate()->toDateTime()->format('Y-m-d') : null,
            'ctpt_energise_date' => $rel->hasCtptEnergiseDate() ? $rel->getCtptEnergiseDate()->toDateTime()->format('Y-m-d') : null,
            'ctpt_change_date' => $rel->hasCtptChangeDate() ? $rel->getCtptChangeDate()->toDateTime()->format('Y-m-d') : null,
            'status_id' => $rel->getStatusId(),
            'status_label' => $rel->getStatus() ? $rel->getStatus()->getParameterValue() : null,
            'change_reason_id' => $rel->getChangeReasonId(),
            'change_reason_label' => $rel->getChangeReason() ? $rel->getChangeReason()->getParameterValue() : null,
            'created_ts' => $rel->hasCreatedTs() ? $rel->getCreatedTs()->toDateTime()->format('Y-m-d') : null,
            'updated_ts' => $rel->hasUpdatedTs() ? $rel->getUpdatedTs()->toDateTime()->format('Y-m-d') : null,
            'created_by' => $rel->getCreatedBy(),
            'updated_by' => $rel->getUpdatedBy(),
            'ctpt_type' => $ctptType,
            'ratio' => $ratio,
        ];
    }
}
