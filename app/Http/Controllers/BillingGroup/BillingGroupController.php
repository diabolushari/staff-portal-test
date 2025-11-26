<?php

namespace App\Http\Controllers\BillingGroup;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BillingGroupController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('BillingGroup/BillingGroupIndexPage');
    }

    public function create(): Response
    {
        return Inertia::render('BillingGroup/BillingGroupCreatePage');
    }
}
