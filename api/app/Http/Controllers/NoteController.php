<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\Note;
use App\Models\NoteTag;
use App\Models\Tag;
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
        $notes = Auth::user()->allAccessibleNotes();

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
            'description' => 'required',
        ]);

        if ($validate->fails()) {
            return $this->incorrectPayload($validate->errors());
        }

        $note = Note::query()->create([
            'user_id' => Auth::user()->id,
            'title' => $request['title'],
            'description' => $request['description'],
            'in_history' => false,
            'role' => 'owner'
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
        $user = Auth::user();

        $note = Note::with(['user', 'tags', 'users', 'attachments'])
            ->where(function ($query) use ($user, $id) {
                $query->where('id', $id)
                    ->where(function ($q) use ($user) {
                        $q->where('user_id', $user->id)
                            ->orWhereHas('users', function ($q2) use ($user) {
                                $q2->where('users.id', $user->id);
                            });
                    });
            })
            ->first();

        if (! $note) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized or note not found'
            ], 403);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Note retrieved successfully',
            'note' => $note
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required',
            'tags' => 'required|array',
        ]);

        if ($validate->fails()) {
            return $this->incorrectPayload($validate->errors());
        }

        $user = Auth::user();
        $note = Note::with(['users'])->where('id', $id)->first();

        if (! $note || ($note->user_id !== $user->id && ! $note->users->contains($user))) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized or note not found'
            ], 403);
        }

        if (!in_array($note->role, ['owner', 'editor'])) {
            return response()->json([
                'status' => 403,
                'message' => 'Insufficient permissions'
            ], 403);
        }

        $note->update([
            'title' => $request['title'],
            'description' => $request['description'],
            'in_history' => false,
        ]);

        NoteTag::query()->where('note_id', $note->id)->delete();

        foreach ($request->input('tags') as $tagData) {
            $tagName = is_array($tagData) ? $tagData['name'] ?? null : $tagData;
            if (!$tagName) continue;

            $tag = Tag::firstOrCreate(['name' => $tagName]);

            NoteTag::create([
                'note_id' => $note->id,
                'tag_id' => $tag->id,
            ]);
        }

        $note = Note::with(['tags', 'user', 'users', 'attachments'])->find($note->id);

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
