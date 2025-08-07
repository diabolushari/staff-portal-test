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
use Proto\consumers\OfficeProto;
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

        $offices = iterator_to_array($response->getOffices()->getIterator()); // Adjust based on actual response

        return Inertia::render('Offices/OfficeIndex', [
            'offices' => $offices,
        ]);
    }

    public function create()
    {
        [$response, $status] = $this->parameterValueClient
            ->ListParameterValues(new ListParameterValuesRequest())
            ->wait();

        if ($status->code !== 0) {
            dd($status);
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

        // Set contact_folio
        $contactFolio = new Struct();
        $contactFolio->setFields([
            'phone' => (new Value())->setStringValue('+91-9865432167'),
            'email' => (new Value())->setStringValue('kseb@office.com'),
        ]);
        $req->setContactFolio($contactFolio);

        // Set all other fields
        $req->setOfficeCode((int) $request->officeCode);
        $req->setOfficeDescription($request->officeDescription);
        $req->setOfficeTypeId((int) $request->officeType);
        $req->setParentOfficeId((int) $request->parentOfficeId ?? 0);
        $req->setLocationId((int) $request->locationId ?? 0);
        $req->setOfficeAddressId((int) $request->officeAddressId ?? 0);
        $req->setIsCurrent(true);


        // Set timestamps
        $start = new Timestamp();
        $start->fromDateTime(new \DateTime($request->effectiveStartDate));
        $req->setEffectiveStart($start);

        $end = new Timestamp();
        $end->fromDateTime(new \DateTime($request->effectiveEndDate));
        $req->setEffectiveEnd($end);

        // Send request
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
}
