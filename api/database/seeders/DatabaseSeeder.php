<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Tag;
use App\Models\Note;
use App\Models\NoteTag;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(2)->create();

        $tags = [
            'Work',
            'Personal',
            'Urgent',
            'Ideas',
            'Meeting',
            'Project',
            'Follow-up',
            'Research',
            'Learning',
            'Finance'
        ];

        foreach ($tags as $tagName) {
            Tag::query()->create(['name' => $tagName]);
        }

        $notesForUser1 = [
            [
                'title' => 'Project Requirements',
                'description' => 'List of requirements for the new project...',
                'tags' => ['Work', 'Project'],
                'role' => 'owner'
            ],
            [
                'title' => 'Meeting Notes',
                'description' => 'Points discussed in today\'s meeting...',
                'tags' => ['Work', 'Meeting'],
                'role' => 'owner'
            ],
            [
                'title' => 'Research on Laravel',
                'description' => 'Notes from research on Laravel framework...',
                'tags' => ['Learning', 'Research'],
                'role' => 'owner'
            ],
        ];

        $notesForUser2 = [
            [
                'title' => 'Ideas for Birthday Gift',
                'description' => 'Gift ideas for upcoming birthday...',
                'tags' => ['Personal'],
                'role' => 'owner'
            ],
            [
                'title' => 'Monthly Budget',
                'description' => 'Budget planning for next month...',
                'tags' => ['Finance', 'Personal'],
                'role' => 'owner'
            ],
            [
                'title' => 'Vacation Planning',
                'description' => 'Places to visit during upcoming vacation...',
                'tags' => ['Personal', 'Ideas'],
                'role' => 'owner'
            ],
        ];

        $this->createNotesForUser($notesForUser1, 1);

        $this->createNotesForUser($notesForUser2, 2);
    }

    /**
     * Create notes for a specific user
     *
     * @param array $notes
     * @param int $userId
     * @return void
     */
    private function createNotesForUser(array $notes, int $userId): void
    {
        foreach ($notes as $noteData) {
            $note = Note::query()->create([
                'title' => $noteData['title'],
                'description' => $noteData['description'],
                'user_id' => $userId,
                'in_history' => false
            ]);

            foreach ($noteData['tags'] as $tagName) {
                $tag = Tag::query()->where('name', $tagName)->first();
                if ($tag) {
                    NoteTag::query()->create([
                        'note_id' => $note->id,
                        'tag_id' => $tag->id
                    ]);
                }
            }
        }
    }
}
