<?php

namespace App\Http\Controllers;

use App\Models\SharedNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ShareController extends Controller
{

    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'note_id' => 'required|integer',
        ]);

        if ($validate->fails()) {
            return $this->incorrectPayload($validate->errors());
        }

        $token = Str::random(8);

        $sharedNote = SharedNote::query()->create([
            'note_id' => $request['note_id'],
            'user_id' => $request['user_id'],
            'token' => $token,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Note has been shared',
            'token' => $sharedNote,
            'url' => 'http://localhost:5173/share/' + $sharedNote->id
        ]);
    }

    public function show(string $id)
    {
        $sharedNote = SharedNote::query()->with(['user', 'note'])->where('id', $id)->first();

        return response()->json([
            'status' => 200,
            'message' => 'Shared note',
            'note' => $sharedNote,
            'token' => $sharedNote->token,
            'url' => 'http://localhost:5173/share/' + $sharedNote->id
        ]);
    }
}
