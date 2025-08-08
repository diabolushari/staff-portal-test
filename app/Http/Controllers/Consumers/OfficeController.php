<?php

namespace App\Http\Controllers\Consumers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Proto\consumers\OfficeServiceClient;
use Grpc\ChannelCredentials;
use Inertia\Inertia;
use Proto\consumers\CreateOfficeRequest;
use App\Services\Grpc\GrpcErrorService;
use Google\Protobuf\GPBEmpty;
use Google\Protobuf\Struct;
use Google\Protobuf\Timestamp;
use Google\Protobuf\Value;
use Proto\Consumers\OfficeIdRequest;
use Proto\Consumers\UpdateOfficeRequest;
use Proto\Parameters\ListParameterValuesRequest;
use Proto\Parameters\ParameterValueServiceClient;

class OfficeController extends Controller
{
    private $client;
    private $parameterValueClient;
    public function __construct()
    {
        $this->client = new OfficeServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
        $this->parameterValueClient = new ParameterValueServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }


    public function index()
    {
        $req = new GPBEmpty();
        [$response, $status] = $this->client->ListOffices($req)->wait();

        if ($status->code !== 0) {
            return redirect()->back()->withErrors([
                'grpc_error' => $status->details,
            ]);
        }
        $offices = $response->getOffices();
        $officeArray = [];
        foreach ($offices as $office) {
            $officeArray[] = json_decode($office->serializeToJsonString(), true);
        }

        return Inertia::render('Offices/OfficeIndex', [
            'offices' => $officeArray,
        ]);
    }


    public function create()
    {
        $request = new ListParameterValuesRequest();
        $request->setDomainName('Organization');
        $request->setParameterName('Distribution Office Types');
        [$response, $status] = $this->parameterValueClient
            ->ListParameterValues($request)
            ->wait();

        if ($status->code !== 0) {
            return redirect()->back()->withErrors([
                'grpc_error' => $status->details,
            ]);
        }

        $allValues = collect($response->getValues())
            ->map(fn($item) => [
                'id' => $item->getId(),
                'parameterValue' => $item->getParameterValue(),
            ])
            ->toArray();


        return Inertia::render('Offices/OfficeForm', [
            'parameterValues' => $allValues,
        ]);
    }





    public function store(Request $request)
    {
        $req = new CreateOfficeRequest();


        $contactFolio = new Struct();
        $contactFolio->setFields([
            'name' => (new Value())->setStringValue($request->contactFolio['name']),
            'address' => (new Value())->setStringValue($request->contactFolio['address']),
            'phone' => (new Value())->setStringValue($request->contactFolio['phone']),
            'email' => (new Value())->setStringValue($request->contactFolio['email']),
        ]);
        $req->setContactFolio($contactFolio);


        $req->setOfficeCode((int) $request->officeCode);
        $req->setOfficeDescription($request->officeDescription);
        $req->setOfficeTypeId((int) $request->officeTypeId);

        $req->setIsCurrent(true);


        $start = new Timestamp();
        $start->fromDateTime(new \DateTime($request->effectiveStartDate));
        $req->setEffectiveStart($start);

        $end = new Timestamp();
        $end->fromDateTime(new \DateTime($request->effectiveEndDate));
        $req->setEffectiveEnd($end);
        [$res, $status] = $this->client->CreateOffice($req)->wait();

        if ($status->code !== 0) {
            dd($status);
            $errors = GrpcErrorService::convertToValidationError($status);

            return redirect()->back()->withErrors($errors);
        }

        return redirect()->back()->with([
            'message' => 'Office created successfully',
        ]);
    }
    public function show($id)
    {
        $req = new OfficeIdRequest();
        $req->setOfficeId($id);

        [$response, $status] = $this->client->GetOfficeById($req)->wait();

        if ($status->code !== 0) {
            return redirect()->back()->withErrors([
                'grpc_error' => $status->details,
            ]);
        }

        // Convert OfficeProto to associative array
        $office = $response->getOffice();
        $officeArray = json_decode($office->serializeToJsonString(), true);

        return Inertia::render('Offices/OfficeShow', [
            'office' => $officeArray,
        ]);
    }

    public function edit($id)
    {
        $req = new OfficeIdRequest();
        $req->setOfficeId($id);

        [$response, $status] = $this->client->GetOfficeById($req)->wait();

        if ($status->code !== 0) {
            return redirect()->back()->withErrors([
                'grpc_error' => $status->details,
            ]);
        }


        $office = $response->getOffice();
        $officeArray = json_decode($office->serializeToJsonString(), true);
        $parameterValuesRequest = new ListParameterValuesRequest();
        $parameterValuesRequest->setDomainName('Organization');
        $parameterValuesRequest->setParameterName('Distribution Office Types');

        [$parameterValues, $parameterValueStatus] = $this->parameterValueClient
            ->ListParameterValues($parameterValuesRequest)
            ->wait();

        $allValues = collect($parameterValues->getValues())
            ->map(fn($item) => [
                'id' => $item->getId(),
                'parameterValue' => $item->getParameterValue(),
            ])
            ->toArray();

        if ($parameterValueStatus->code !== 0) {
            return redirect()->back()->withErrors([
                'grpc_error' => $parameterValueStatus->details,
            ]);
        }

        return Inertia::render('Offices/OfficeForm', [
            'parameterValues' => $allValues,
            'office' => $officeArray,

        ]);
    }

    public function update(Request $request, $id)
    {
        $req = new UpdateOfficeRequest();
        $req->setOfficeId($id);
        $req->setOfficeCode($request->officeCode);
        $req->setOfficeDescription($request->officeDescription);
        $req->setOfficeTypeId($request->officeTypeId);
        $start = new Timestamp();
        $start->fromDateTime(new \DateTime($request->effectiveStartDate));
        $req->setEffectiveStart($start);

        $end = new Timestamp();
        $end->fromDateTime(new \DateTime($request->effectiveEndDate));
        $req->setEffectiveEnd($end);
        $req->setIsCurrent($request->isCurrent);
        $contactFolio = new Struct();
        $contactFolio->setFields([
            'name' => (new Value())->setStringValue($request->contactFolio['name']),
            'address' => (new Value())->setStringValue($request->contactFolio['address']),
            'phone' => (new Value())->setStringValue($request->contactFolio['phone']),
            'email' => (new Value())->setStringValue($request->contactFolio['email']),
        ]);
        $req->setContactFolio($contactFolio);

        [$response, $status] = $this->client->UpdateOffice($req)->wait();
        if ($status->code !== 0) {

            $errors = GrpcErrorService::convertToValidationError($status);
            dd($errors, $status);
            return redirect()->back()->withErrors($errors);
        }

        return redirect()->back()->with([
            'message' => 'Office updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $req = new OfficeIdRequest();
        $req->setOfficeId($id);
        [$response, $status] = $this->client->DeleteOffice($req)->wait();
        if ($status->code !== 0) {

            $errors = GrpcErrorService::convertToValidationError($status);
            return redirect()->back()->withErrors($errors);
        }
        return redirect()->back()->with([
            'message' => 'Office deleted successfully',
        ]);
    }
}
