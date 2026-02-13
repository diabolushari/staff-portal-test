<?php

namespace App\Http\Controllers\SecurityDeposit;

use App\Http\Controllers\Controller;
use App\Http\Requests\SecurityDeposit\SdDemandFormRequest;
use App\Services\SecurityDeposit\SdDemandsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SdDemandsController extends Controller
{

    public function __construct(private readonly SdDemandsService $sdDemandService) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SecurityDeposit/SdDemands/SdDemandCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SdDemandFormRequest $request)
    {
        $response = $this->sdDemandService->create($request);
        dd($response);

        if ($response->data === null) {
            return redirect()->back()->with('error', 'Failed to create security deposit demand');
        }
        $sdDemand = $response->data;

        return redirect()->route('sd-demands.index')
            ->with('message', 'Security deposit demand created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $sdDemand = $this->sdDemandService->getSdDemand($id);

        return Inertia::render('SecurityDeposit/SdDemands/SdDemandShow', [
            'sdDemand' => $sdDemand,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $sdDemand = $this->sdDemandService->getSdDemand($id);

        return Inertia::render('SecurityDeposit/SdDemands/SdDemandCreate', [
            'sdDemand' => $sdDemand,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
