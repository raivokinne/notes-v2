<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::query()->with('notes')->get();

        return response()->json([
            'status' => 200,
            'message' => 'List of tags',
            'tags' => $tags,
        ]);
    }
}
