<?php

namespace App\Http\Controllers\Consumers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Proto\Parameters\ParameterValueServiceClient;
use Grpc\ChannelCredentials;
use Proto\Parameters\ListParameterValuesRequest;

class PartiesController extends Controller
{

    private $client;
    private $parameterValueClient;
    public function __construct()
    {
        // $this->client = new PartyServiceClient(env('GRPC_HOST'), [
        //     'credentials' => ChannelCredentials::createInsecure()
        // ]);
        $this->parameterValueClient = new ParameterValueServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure()
        ]);
    }
    public function index()
    {
        return Inertia::render('Parties/PartiesIndex');
    }

    public function create()
    {
        $request = new ListParameterValuesRequest();
        $statusRequest = new ListParameterValuesRequest();
        $request->setDomainName('Parties');
        $request->setParameterName('Party Type');
        $statusRequest->setDomainName('Parties');
        $statusRequest->setParameterName('Status');
        [$partyTypes, $partyTypeStatus] = $this->parameterValueClient->ListParameterValues($request)->wait();
        [$partyStatus, $partyStatusStatus] = $this->parameterValueClient->ListParameterValues($statusRequest)->wait();
        if ($partyTypeStatus->code !== 0 || $partyStatusStatus->code !== 0) {
            return redirect()->back()->withErrors([
                'grpc_error' => $partyTypeStatus->details,
            ]);
        }
        $partyTypes = collect($partyTypes->getValues())
            ->map(fn($item) => [
                'id' => $item->getId(),
                'parameterValue' => $item->getParameterValue(),
            ])
            ->toArray();
        $partyStatus = collect($partyStatus->getValues())
            ->map(fn($item) => [
                'id' => $item->getId(),
                'parameterValue' => $item->getParameterValue(),
            ])
            ->toArray();
        return Inertia::render('Parties/PartiesForm', [
            'partyTypes' => $partyTypes,
            'partyStatus' => $partyStatus
        ]);
    }



    public function store(Request $request)
    {
        return Inertia::render('Parties/PartiesIndex');
    }

    public function show($id)
    {
        return Inertia::render('Parties/PartiesShow');
    }

    public function edit($id)
    {
        $request = new ListParameterValuesRequest();
        $statusRequest = new ListParameterValuesRequest();
        $request->setDomainName('Parties');
        $request->setParameterName('Party Type');
        $statusRequest->setDomainName('Parties');
        $statusRequest->setParameterName('Status');
        [$partyTypes, $partyTypeStatus] = $this->parameterValueClient->ListParameterValues($request)->wait();
        [$partyStatus, $partyStatusStatus] = $this->parameterValueClient->ListParameterValues($statusRequest)->wait();
        if ($partyTypeStatus->code !== 0 || $partyStatusStatus->code !== 0) {
            return redirect()->back()->withErrors([
                'grpc_error' => $partyTypeStatus->details,
            ]);
        }
        $partyTypes = collect($partyTypes->getValues())
            ->map(fn($item) => [
                'id' => $item->getId(),
                'parameterValue' => $item->getParameterValue(),
            ])
            ->toArray();
        $partyStatus = collect($partyStatus->getValues())
            ->map(fn($item) => [
                'id' => $item->getId(),
                'parameterValue' => $item->getParameterValue(),
            ])
            ->toArray();
        return Inertia::render('Parties/PartiesForm', [
            'partyTypes' => $partyTypes,
            'partyStatus' => $partyStatus
        ]);
    }

    public function update(Request $request, $id)
    {
        return Inertia::render('Parties/PartiesIndex');
    }

    public function destroy($id)
    {
        return Inertia::render('Parties/PartiesIndex');
    }
}
