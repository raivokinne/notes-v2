<?php

namespace App\Http\Controllers;

use App\Models\NoteAttachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttachmentsController extends Controller
{
    public function store(Request $request, string $id): JsonResponse
    {
        $validate = Validator::make($request->all(), [
            'file' => 'required|image|mimes:jpg,png,gif,svg|max:2048'
        ]);

        if ($validate->fails()) {
            return $this->incorrectPayload($validate->errors());
        }

        $file = $request->file('file');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('attachments', $filename, 'public');

        $attachment = NoteAttachment::query()->create([
            'note_id' => $id,
            'path' => $path
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Attachment uploaded successfully',
            'attachment' => $attachment
        ]);
    }
}
