<?php

use App\Http\Controllers\Api\BillingGroupListApiController;
use App\Http\Controllers\Api\Connections\PartiesListApiController;
use App\Http\Controllers\Api\GetOfficeByCodeApiController;
use App\Http\Controllers\Api\GetOfficeByIdApiController;
use App\Http\Controllers\Api\Metering\UnassignedMetersApiController;
use App\Http\Controllers\Api\Metering\UnassignedTransformersApiController;
use App\Http\Controllers\Api\OfficeListApiController;
use App\Http\Controllers\Api\Parameter\ListParameterValuesApiController;
use App\Http\Controllers\Api\ParameterDefinitionItemApiController;
use App\Http\Controllers\Api\ParameterDefinitionListApiController;
use App\Http\Controllers\Api\ParameterDomainListApiController;
use App\Http\Controllers\Api\SystemModuleApiController;
use App\Http\Controllers\Api\Tariff\TariffOrderDownloadApiController;
use App\Http\Controllers\Billing\BillController;
use App\Http\Controllers\Billing\BillingPdfController;
use App\Http\Controllers\Billing\BillingRuleController;
use App\Http\Controllers\Billing\BillInitializeController;
use App\Http\Controllers\BillingCycle\BillJobStatusController;
use App\Http\Controllers\BillingGroup\BillingGroupBillController;
use App\Http\Controllers\BillingGroup\BillingGroupConnectionRelController;
use App\Http\Controllers\BillingGroup\BillingGroupController;
use App\Http\Controllers\BillingGroup\ConsumerNumberApiController;
use App\Http\Controllers\Connection\ConnectionController;
use App\Http\Controllers\Connection\ConnectionFlagController;
use App\Http\Controllers\Connection\ConnectionGenerationController;
use App\Http\Controllers\Connection\ConnectionsPartyController;
use App\Http\Controllers\Connection\ConsumerController;
use App\Http\Controllers\Connection\CreateConsumerController;
use App\Http\Controllers\Connection\GetConnectionMeterController;
use App\Http\Controllers\Connection\GetConnectionMeterTransformerController;
use App\Http\Controllers\Connection\GetConnectionPartyController;
use App\Http\Controllers\Connection\GetConsumerController;
use App\Http\Controllers\Connection\MeterConnectionMappingUpdateChangeController;
use App\Http\Controllers\Connection\MeterConnectionMappingUpdateStatusController;
use App\Http\Controllers\Consumers\CreateGeoregionSeedController;
use App\Http\Controllers\Consumers\OfficeController;
use App\Http\Controllers\Consumers\PartiesController;
use App\Http\Controllers\Consumers\UpdateOfficeContactsController;
use App\Http\Controllers\Metering\CreateMeterReadingController;
use App\Http\Controllers\Metering\MeterConnectionMappingController;
use App\Http\Controllers\Metering\MeterConnectionMappingCreateController;
use App\Http\Controllers\Metering\MeterConnectionMappingEditController;
use App\Http\Controllers\Metering\MeterConnectionProfileUpdateController;
use App\Http\Controllers\Metering\MeterController;
use App\Http\Controllers\Metering\MeterReadingController;
use App\Http\Controllers\Metering\MeterTimezoneTypeRelController;
use App\Http\Controllers\Metering\MeterTransfomerCreateController;
use App\Http\Controllers\Metering\MeterTransformerController;
use App\Http\Controllers\Metering\MeterTransformerRelController;
use App\Http\Controllers\MeteringTimezone\MeteringTimezoneController;
use App\Http\Controllers\MeterProfileParameter\MeterProfileParameterController;
use App\Http\Controllers\MeterReading\GetMeterReadingEditController;
use App\Http\Controllers\MeterReading\GetMeterReadingWithConnectionController;
use App\Http\Controllers\MeterTransformer\ChangeMeterTransformerAssignmentController;
use App\Http\Controllers\MeterTransformer\UpdateMeterTransformerAssignmentStatusController;
use App\Http\Controllers\Offices\OfficeBillingController;
use App\Http\Controllers\Offices\OfficeHierarchyRelController;
use App\Http\Controllers\Offices\OfficesCreateWithCsvController;
use App\Http\Controllers\Parameter\ParameterDefinitionController;
use App\Http\Controllers\Parameter\ParameterDomainController;
use App\Http\Controllers\Parameter\ParameterValueController;
use App\Http\Controllers\Settings\SettingsDetailController;
use App\Http\Controllers\SystemModule\SystemModuleController;
use App\Http\Controllers\Tariff\TariffConfigController;
use App\Http\Controllers\Tariff\TariffOrderController;
use App\Http\Requests\SystemModule\SystemModuleFormRequest;
use App\Services\SystemModule\SystemModuleService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('connections.index');
    })->name('dashboard');
    Route::resource('system-module', SystemModuleController::class);
    Route::resource('parameter-domain', ParameterDomainController::class);
    Route::resource('parameter-definition', ParameterDefinitionController::class);
    Route::resource('parameter-value', ParameterValueController::class);
    Route::resource('offices', OfficeController::class);
    Route::get('offices/{officeCode}/billings', OfficeBillingController::class)->name('offices.billings');
    Route::resource('parties', PartiesController::class);
    Route::resource('connections', ConnectionController::class);
    Route::resource('consumers', ConsumerController::class);
    Route::resource('office-hierarchy-rel', OfficeHierarchyRelController::class);

    Route::get('connection/{id}/consumer', GetConsumerController::class)
        ->name('connection.consumer');
    Route::get('connection/{id}/consumer/create', CreateConsumerController::class)
        ->name('connection.consumer.create');
    Route::resource('connection-flag', ConnectionFlagController::class);
    Route::resource('connection-generation', ConnectionGenerationController::class);

    Route::post('update-office-contacts', UpdateOfficeContactsController::class)
        ->name('offices.update-contacts');
    Route::resource('meters', MeterController::class);
    Route::resource('meter-timezone-rel', MeterTimezoneTypeRelController::class);
    Route::get('connections/{connection_id}/meters/{id}/ctpt/create', MeterTransfomerCreateController::class)
        ->name('connections.meters.ctpt.create');
    Route::get('connection/{id}/parties', GetConnectionPartyController::class)->name('connection.parties');
    Route::resource('connection-parties', ConnectionsPartyController::class);
    Route::get('connection/{id}/meters', GetConnectionMeterController::class)
        ->name('connection.meters');
    Route::get('connections/{id}/meters/ctpts', GetConnectionMeterTransformerController::class)
        ->name('connections.meters.ctpts');
    Route::put('connections/{id}/meter-status', MeterConnectionMappingUpdateStatusController::class)
        ->name('connection.meter-status.update');
    Route::put('connections/{id}/meter-change', MeterConnectionMappingUpdateChangeController::class)
        ->name('connection.meter-change.update');
    Route::get('connection/{id}/meter/create', MeterConnectionMappingCreateController::class)
        ->name('connection.meter.create');
    Route::resource('meter-connection-rel', MeterConnectionMappingController::class);
    Route::put('meter-connection-profile-update/{id}', MeterConnectionProfileUpdateController::class)
        ->name('meter-connection-profile-update');
    Route::post('meter-connection-rel/{id}', [MeterConnectionMappingController::class, 'update'])->name('meter-connection-rel.update');
    Route::get('connection/{id}/meter/edit', MeterConnectionMappingEditController::class)
        ->name('connection.meter.edit');
    Route::delete('meter-connection-rel/{rel_id}', [MeterConnectionMappingController::class, 'destroy'])
        ->name('meter-connection-rel.destroy');

    Route::resource('meter-ctpt', MeterTransformerController::class);
    Route::resource('meter-ctpt-rel', MeterTransformerRelController::class);
    Route::resource('meter-conn-rel', MeterConnectionMappingController::class);
    Route::resource('meter-timezone-rel', MeterTimezoneTypeRelController::class);

    Route::resource('timezone-groups', MeteringTimezoneController::class);

    Route::resource('meter-reading', MeterReadingController::class);
    Route::get('connection/{connection_id}/meter-reading', GetMeterReadingWithConnectionController::class)->name('connection.meter-reading');
    Route::get('connection/{connection_id}/meter-reading/create', CreateMeterReadingController::class)->name('connection-meter-reading.create');
    Route::get('connection/{connection_id}/meter-reading/edit', GetMeterReadingEditController::class)->name('meter-reading.edit');

    Route::resource('tariff-orders', TariffOrderController::class);
    Route::resource('tariff-configs', TariffConfigController::class);
    Route::get('tariff-order/{tariffOrderId}/config/create', [TariffConfigController::class, 'create'])
        ->name('tariff-config.create');

    Route::resource('billing-rules', BillingRuleController::class);
    Route::resource('billing-groups', BillingGroupController::class);
    Route::get('billing-groups/{billingGroupId}/bills', BillingGroupBillController::class)->name('billing-group.bills');
    Route::resource('bills/job-status', BillJobStatusController::class);
    Route::resource('billing-group-connection-rel', BillingGroupConnectionRelController::class);
    Route::resource('bills', BillController::class);
    Route::post('initialize-bill', BillInitializeController::class)->name('billing-group.initialize-bill');

    Route::post('change-meter-transformer-assignment', ChangeMeterTransformerAssignmentController::class)
        ->name('change-meter-transformer-assignment');

    Route::post('update-meter-transformer-assignment-status', UpdateMeterTransformerAssignmentStatusController::class)
        ->name('update-meter-transformer-assignment-status');

    Route::resource('meter-profile', MeterProfileParameterController::class);
});

Route::get('api/system-modules', SystemModuleApiController::class);
Route::get('api/parameter-domains', ParameterDomainListApiController::class);
Route::get('api/parameter-definitions', ParameterDefinitionListApiController::class);
Route::get('api/parameter-definitions/{id}', ParameterDefinitionItemApiController::class);
Route::get('api/offices', OfficeListApiController::class);
Route::get('api/consumer-number', ConsumerNumberApiController::class);
Route::get('api/office/{id}', GetOfficeByIdApiController::class);
Route::get('api/parameter-values', ListParameterValuesApiController::class);
Route::get('api/office/code/{office_code}', GetOfficeByCodeApiController::class);
Route::get('api/parties', PartiesListApiController::class);
Route::get('api/unassigned-transformers', UnassignedTransformersApiController::class);
Route::get('api/unassigned-meters', UnassignedMetersApiController::class);
Route::get('api/billing-groups', BillingGroupListApiController::class);
Route::get('api/tariff-order/{id}/download', TariffOrderDownloadApiController::class)->name('tariff-order.download');

Route::get('consumer-test', function (SystemModuleService $service) {
    $response = $service->createSystemModule(
        new SystemModuleFormRequest('Test Module')
    );

    return response()->json($response);
});

Route::get('offices-create-with-csv', OfficesCreateWithCsvController::class)->name('offices.create-with-csv');
Route::get('create-georegion-seed', CreateGeoregionSeedController::class)->name('create-georegion-seed');
Route::get('page-ui', function () {
    return Inertia::render('UItest');
})->name('page-ui');

Route::get('settings-page', [SettingsDetailController::class, 'settingsDetail'])
    ->name('settings-page');

// pdf download
Route::get('pdf-download/{billId}', [BillingPdfController::class, 'index'])->name('pdf-download');
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
