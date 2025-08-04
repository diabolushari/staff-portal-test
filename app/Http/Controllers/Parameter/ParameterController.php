<?php

namespace App\Http\Controllers\Parameter;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class ParameterController extends Controller
{

    public function index()
    {
        return Inertia::render('Parameters/ParameterIndex');
    }
}
