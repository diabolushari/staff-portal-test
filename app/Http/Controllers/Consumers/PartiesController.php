<?php

namespace App\Http\Controllers\Consumers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parties\PartiesFormRequest;
use App\Services\Parties\PartyService;
use Grpc\ChannelCredentials;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Proto\Parameters\ListParameterValuesRequest;
use Proto\Parameters\ParameterValueServiceClient;

// TODO: FIX Error Handling.
class PartiesController extends Controller
{
    private PartyService $partyService;

    // TODO: Dependency Injection
    private $parameterValueClient;

    public function __construct()
    {
        $this->partyService = new PartyService;
        $this->parameterValueClient = new ParameterValueServiceClient(env('GRPC_HOST'), [
            'credentials' => ChannelCredentials::createInsecure(),
        ]);
    }

    public function index(Request $request)
    {
        // Get parties from gRPC service
        $partiesResponse = $this->partyService->getParties();

        /* if (!$partiesResponse->isSuccess()) { */
        /*     return redirect()->back()->withErrors([ */
        /*         'grpc_error' => $partiesResponse->getErrorMessage(), */
        /*     ]); */
        /* } */

        /* $parties = $partiesResponse->getData(); */

        // Get parameter values for display (party types and statuses)
        /* $parameterData = $this->getParameterData(); */

        return Inertia::render('Parties/PartiesIndex', [
            'parties' => $partiesResponse,
            /* 'partyTypes' => $parameterData['partyTypes'] ?? [], */
            /* 'partyStatuses' => $parameterData['partyStatuses'] ?? [], */
        ]);
    }

    public function create()
    {
        // TODO use paramater value service
        $request = new ListParameterValuesRequest;
        $statusRequest = new ListParameterValuesRequest;
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
            ->map(fn ($item) => [
                'id' => $item->getId(),
                'parameterValue' => $item->getParameterValue(),
            ])
            ->toArray();

        $partyStatus = collect($partyStatus->getValues())
            ->map(fn ($item) => [
                'id' => $item->getId(),
                'parameterValue' => $item->getParameterValue(),
            ])
            ->toArray();

        return Inertia::render('Parties/PartiesForm', [
            'partyTypes' => $partyTypes,
            'partyStatus' => $partyStatus,
        ]);
    }

    public function store(PartiesFormRequest $request)
    {

        $request->createdBy = auth()->user()?->id;
        $request->updatedBy = auth()->user()?->id;
        $response = $this->partyService->createParty($request);

        return redirect()->to('/parties');
    }

    public function show(int $id)
    {
        $partyResponse = $this->partyService->getParty($id);
        $party = $partyResponse->data;

        return Inertia::render('Parties/PartiesShow', [
            'party' => $party,
        ]);
    }

    public function edit(int $id)
    {
        $partyResponse = $this->partyService->getParty($id);

        $party = $partyResponse->data;

        $request = new ListParameterValuesRequest;
        $statusRequest = new ListParameterValuesRequest;
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
            ->map(fn ($item) => [
                'id' => $item->getId(),
                'parameterValue' => $item->getParameterValue(),
            ])
            ->toArray();
        $partyStatus = collect($partyStatus->getValues())
            ->map(fn ($item) => [
                'id' => $item->getId(),
                'parameterValue' => $item->getParameterValue(),
            ])
            ->toArray();

        return Inertia::render('Parties/PartiesForm', [
            'party' => $party,
            'partyTypes' => $partyTypes,
            'partyStatus' => $partyStatus,
        ]);
    }

    public function update(PartiesFormRequest $partiesFormRequest)
    {
        $partiesFormRequest->updatedBy = auth()->id();
        $this->partyService->updateParty($partiesFormRequest);

        return redirect()->to('/parties');
    }

    public function destroy(int $id)
    {
        $this->partyService->deleteParty($id);

        return redirect()->back();
    }
}
