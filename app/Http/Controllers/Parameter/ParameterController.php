<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParameterController extends Controller
{

    public function index()
    {
        return Inertia::render('Parameters/ParameterIndex');
    }
}
