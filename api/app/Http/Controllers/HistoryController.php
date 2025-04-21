<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $histories = History::with(['user', 'note', 'note.tags'])->where('user_id', Auth::user()->id)->get();

        return response()->json([
            'status' => 200,
            'message' => 'List of histories',
            'histories' => $histories
        ]);
    }
}
