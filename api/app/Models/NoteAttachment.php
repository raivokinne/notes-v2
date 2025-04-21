<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NoteAttachment extends Model
{
    protected $fillable = [
        'path',
        'note_id',
    ];

    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }
}
