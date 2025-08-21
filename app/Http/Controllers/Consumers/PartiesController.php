<?php

namespace App\Http\Controllers\Consumers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parties\PartiesFormRequest;
use App\Services\Parties\PartyService;
use Grpc\ChannelCredentials;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Proto\Parameters\ListParameterValuesRequest;
use Proto\Parameters\ParameterValueServiceClient;

class PartiesController extends Controller
{
    private PartyService $partyService;
    private ParameterValueServiceClient $parameterValueClient;

    public function __construct(PartyService $partyService)
    {
        $this->partyService = $partyService;

        // Manually instantiate the gRPC client for Parameter Values, as per the original code.
        $this->parameterValueClient = new ParameterValueServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    /**
     * Display a listing of the parties.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $partiesResponse = $this->partyService->getParties();

        if (!$partiesResponse->success) {
            return $partiesResponse->error ?? back()->withErrors(['grpc_error' => 'An unknown error occurred while fetching parties.']);
        }

        return Inertia::render('Parties/PartiesIndex', [
            'parties' => $partiesResponse,
        ]);
    }

    /**
     * Show the form for creating a new party.
     * --- THIS METHOD IS REVERTED TO THE ORIGINAL VERSION ---
     */
    public function create(): Response|RedirectResponse
    {
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
                'grpc_error' => $partyTypeStatus->details ?: $partyStatusStatus->details,
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

    /**
     * Store a newly created party in storage.
     */
    public function store(PartiesFormRequest $request): RedirectResponse
    {
        $request->createdBy = auth()->id();
        $response = $this->partyService->createParty($request);

        if (!$response->success) {
            return $response->error ?? back()->withInput()->withErrors(['grpc_error' => 'Failed to create the party.']);
        }

        return redirect()->route('parties.index')->with('success', 'Party created successfully.');
    }

    /**
     * Display the specified party.
     */
    public function show(int $id): Response|RedirectResponse
    {
        $partyResponse = $this->partyService->getParty($id);

        if (!$partyResponse->success) {
            return $partyResponse->error ?? redirect()->route('parties.index')->withErrors(['grpc_error' => 'Could not find the requested party.']);
        }

        return Inertia::render('Parties/PartiesShow', [
            'party' => $partyResponse->data,
        ]);
    }

    /**
     * Show the form for editing the specified party.
     * --- THIS METHOD IS REVERTED TO THE ORIGINAL VERSION ---
     */
    public function edit(int $id): Response|RedirectResponse
    {
        // First, get the specific party to edit
        $partyResponse = $this->partyService->getParty($id);
        if (!$partyResponse->success) {
            return $partyResponse->error ?? redirect()->route('parties.index')->withErrors(['grpc_error' => 'Could not find the party to edit.']);
        }
        $party = $partyResponse->data;

        // Second, get the dropdown data using the original, duplicated logic
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
                'grpc_error' => $partyTypeStatus->details ?: $partyStatusStatus->details,
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

        // Finally, render the view with all the necessary data
        return Inertia::render('Parties/PartiesForm', [
            'party' => $party,
            'partyTypes' => $partyTypes,
            'partyStatus' => $partyStatus,
        ]);
    }

    /**
     * Update the specified party in storage.
     */
    public function update(PartiesFormRequest $request, int $id): RedirectResponse
    {
        $request->versionId = $id;
        $request->updatedBy = auth()->id();
        $response = $this->partyService->updateParty($request);

        if (!$response->success) {
            return $response->error ?? back()->withInput()->withErrors(['grpc_error' => 'Failed to update the party.']);
        }

        return redirect()->route('parties.index')->with('success', 'Party updated successfully.');
    }

    /**
     * Remove the specified party from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $response = $this->partyService->deleteParty($id);

        if (!$response->success) {
            return $response->error ?? back()->withErrors(['grpc_error' => 'Failed to delete the party.']);
        }

        return redirect()->route('parties.index')->with('success', 'Party deleted successfully.');
    }
}
