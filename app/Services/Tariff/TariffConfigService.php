<?php

namespace App\Services\Tariff;

use App\Http\Requests\Tariff\TariffConfigFormItems;
use App\Http\Requests\Tariff\TariffConfigFormRequest;
use App\Http\Requests\Tariff\TariffConfigUpdateFormRequest;
use App\Services\Grpc\GrpcErrorService;
use App\Services\Parameters\ParameterValueService;
use App\Services\utils\DateTimeConverter;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Illuminate\Support\Facades\Auth;
use Proto\Tariff\CreateMultipleTariffConfigRequest;
use Proto\Tariff\DeleteTariffConfigRequest;
use Proto\Tariff\GetTariffConfigRequest;
use Proto\Tariff\ListTariffConfigPaginatedRequest;
use Proto\Tariff\ListTariffConfigPaginatedResponse;
use Proto\Tariff\TariffConfigFormMessage;
use Proto\Tariff\TariffConfigMessage;
use Proto\Tariff\TariffConfigServiceClient;
use Proto\Tariff\UpdateTariffConfigRequest;

class TariffConfigService
{
    private TariffConfigServiceClient $client;

    public function __construct(
        private ParameterValueService $parameterValueService,
        private TariffOrderService $tariffOrderService
    ) {
        $this->client = new TariffConfigServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listPaginatedTariffConfigs(?int $pageNumber = 1, ?int $pageSize = 10, ?int $tariffOrderId = null): GrpcServiceResponse
    {
        $grpcRequest = new ListTariffConfigPaginatedRequest;
        if ($pageNumber) {
            $grpcRequest->setPageNumber($pageNumber);
        }
        if ($pageSize) {
            $grpcRequest->setPageSize($pageSize);
        }
        if ($tariffOrderId) {
            $grpcRequest->setTariffOrderId($tariffOrderId);
        }

        [$response, $status] = $this->client->listTariffConfigPaginated($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success($this->convertToPaginatedArray($response), $response, $status->code, $status->details);
    }

    public function createTariffConfig(TariffConfigFormRequest $request): GrpcServiceResponse
    {

        $configs = collect($request->tariffConfigItems->items())
            ->map(fn (TariffConfigFormItems $item) => $this->configFormToGrpcMessage($item, $request->tariffOrderId)
            )
            ->toArray();

        $grpcRequest = new CreateMultipleTariffConfigRequest;
        $grpcRequest->setConfigs($configs);

        [$response, $status] = $this->client->createMultipleTariffConfig($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $configs = $response->getCreatedConfigs();
        $cofigItems = [];
        foreach ($configs as $config) {
            $cofigItems[] = $this->tariffConfigMessageToArray($config);
        }

        return GrpcServiceResponse::success($cofigItems, $response, $status->code, $status->details);
    }

    public function getTariffConfig(int $id): GrpcServiceResponse
    {
        $grpcRequest = new GetTariffConfigRequest;
        $grpcRequest->setTariffConfigId($id);

        [$response, $status] = $this->client->getTariffConfig($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success($this->tariffConfigMessageToArray($response->getConfig()), $response, $status->code, $status->details);
    }

    public function updateTariffConfig(TariffConfigUpdateFormRequest $request, int $id): GrpcServiceResponse
    {
        $grpcRequest = new UpdateTariffConfigRequest;
        $grpcRequest->setConfig($this->configToGrpcMessage($request));

        [$response, $status] = $this->client->updateTariffConfig($grpcRequest)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }

        return GrpcServiceResponse::success($this->tariffConfigMessageToArray($response->getConfig()), $response, $status->code, $status->details);
    }

    public function deleteTariffConfig(int $id): GrpcServiceResponse
    {
        $grpcRequest = new DeleteTariffConfigRequest;
        $grpcRequest->setTariffConfigId($id);
        $userId = Auth::id();
        if ($userId) {
            $grpcRequest->setDeletedBy(intval($userId));
        }

        [$response, $status] = $this->client->deleteTariffConfig($grpcRequest)->wait();

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

    public function configFormToGrpcMessage(TariffConfigFormItems $request, int $tariffOrderId): TariffConfigFormMessage
    {
        $msg = new TariffConfigFormMessage;
        $msg->setTariffOrderId($tariffOrderId);
        $msg->setConnectionPurposeId($request->connectionPurpose);
        $msg->setConnectionTariffId($request->connectionTariff);
        $msg->setConsumptionLowerLimit($request->consumptionLowerLimit);
        $msg->setConsumptionUpperLimit($request->consumptionUpperLimit);
        $msg->setDemandChargeKva($request->demandChargeKva);
        $msg->setEnergyChargeKwh($request->energyChargeKwh);
        $msg->setEffectiveStart(DateTimeConverter::convertStringToTimestamp($request->effectiveStart));
        $msg->setEffectiveEnd(DateTimeConverter::convertStringToTimestamp($request->effectiveEnd));

        return $msg;
    }

    /**
     * @return array<string, mixed>
     */
    public function tariffConfigMessageToArray(TariffConfigMessage $msg): array
    {
        return [
            'tariff_config_id' => $msg->getTariffConfigId(),
            'tariff_order_id' => $msg->getTariffOrderId(),
            'connection_purpose' => $this->parameterValueService->toArray($msg->getConnectionPurpose()),
            'connection_tariff' => $this->parameterValueService->toArray($msg->getConnectionTariff()),
            'consumption_lower_limit' => $msg->getConsumptionLowerLimit(),
            'consumption_upper_limit' => $msg->getConsumptionUpperLimit(),
            'demand_charge_kva' => $msg->getDemandChargeKva(),
            'energy_charge_kwh' => $msg->getEnergyChargeKwh(),
            'tariff_order' => $msg->getTariffOrder() ? $this->tariffOrderService->tariffMessageToArray($msg->getTariffOrder()) : null,
            'effective_start' => DateTimeConverter::convertTimestampToString($msg->getEffectiveStart()),
            'effective_end' => DateTimeConverter::convertTimestampToString($msg->getEffectiveEnd()),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function convertToPaginatedArray(ListTariffConfigPaginatedResponse $response): array
    {
        $configs = $response->getConfigs();
        $array = [];
        foreach ($configs as $item) {
            $array[] = $this->tariffConfigMessageToArray($item);
        }

        return [
            'tariff_configs' => $array,
            'total_count' => $response->getTotalCount(),
            'page_number' => $response->getPageNumber(),
            'page_size' => $response->getPageSize(),
            'total_pages' => $response->getTotalPages(),
        ];
    }

    public function configToGrpcMessage(TariffConfigUpdateFormRequest $request): TariffConfigFormMessage
    {
        $msg = new TariffConfigFormMessage;
        $msg->setTariffConfigId($request->tariffConfigId);
        $msg->setTariffOrderId($request->tariffOrderId);
        $msg->setConnectionPurposeId($request->connectionPurposeId);
        $msg->setConnectionTariffId($request->connectionTariffId);
        $msg->setConsumptionLowerLimit($request->consumptionLowerLimit);
        $msg->setConsumptionUpperLimit($request->consumptionUpperLimit);
        $msg->setDemandChargeKva($request->demandChargeKva);
        $msg->setEnergyChargeKwh($request->energyChargeKwh);
        $msg->setEffectiveStart(DateTimeConverter::convertStringToTimestamp($request->effectiveStart));
        if ($request->effectiveEnd) {
            $msg->setEffectiveEnd(DateTimeConverter::convertStringToTimestamp($request->effectiveEnd));
        }

        return $msg;
    }
}
