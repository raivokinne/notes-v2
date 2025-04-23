<?php

namespace App\Http\Controllers;

use App\Models\Note;
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
            return $this->incorrectpayload($validate->errors());
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
            'token' => $token,
            'url' => 'http://localhost:5173/share/' . $sharedNote->id
        ]);
    }

    public function verify(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'token' => 'required|string|min:8'
        ]);

        if ($validate->fails()) {
            return $this->incorrectpayload($validate->errors());
        }

        $sharedNote = SharedNote::query()->where('token', $request->token)->first();

        if (!$sharedNote) {
            return $this->incorrectpayload(['token' => 'Incorrect Token']);
        }

        $note = Note::query()->where('id', $sharedNote->note_id)->first();

        $note->update([
            'user_id' => $sharedNote->user_id
        ]);

        $note->save();

        return response()->json([
            'status' => 200,
            'message' => 'You have access to note',
            'note' => $note
        ]);
    }

    public function index()
    {
        $sharedNotes = SharedNote::query()->with(['note', 'user'])->get();

        return response()->json([
            'status' => 200,
            'message' => 'List of shared notes',
            'sharedNotes' => $sharedNotes
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
            'url' => 'http://localhost:5173/share/' . $sharedNote->id
        ]);
    }
}
