<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $notes = Note::query()
                        ->with(['user', 'tags', 'sharedWith', 'attachments'])
                        ->where('user_id', Auth::user()->id)
                        ->get();

        return response()->json([
            'status' => 200,
            'message' => 'List of Notes',
            'notes' => $notes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required'
        ]);

        if ($validate->fails()) {
            return $this->incorrectPayload($validate->errors());
        }

        $note = Note::query()->create([
            'user_id' => Auth::user()->id,
            'title' => $request['title'],
            'description' => $request['description'],
            'in_history' => false
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Note created successfully',
            'note' => $note
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $note = Note::query()->with(['user', 'tags', 'sharedWith', 'attachments'])->where('id', $id)->first();

        return response()->json([
            'status' => 200,
            'message' => 'Your note',
            'note' => $note
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validate = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required'
        ]);

        if ($validate->fails()) {
            return $this->incorrectPayload($validate->errors());
        }

        $note = Note::query()->where('id', $id)->first();

        $note->update([
            'title' => $request['title'],
            'description' => $request['description'],
            'in_history' => false
        ]);

        $note->save();

        return response()->json([
            'status' => 200,
            'message' => 'Note updated successfully',
            'note' => $note
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $note = Note::query()->where('id', $id)->first();

        History::query()->create([
            'note_id' => $note->id,
            'user_id' => Auth::user()->id,
            'expires' => Carbon::now()->addDays(30),
        ]);

        $note->update([
            'user_id' => $note->user_id,
            'title' => $note->title,
            'description' => $note->description,
            'in_history' => true
        ]);

        $note->save();

        return response()->json([
            'status' => 200,
            'message' => 'Note has been moved to history for 30 days',
            'note' => $note
        ]);
    }
}
