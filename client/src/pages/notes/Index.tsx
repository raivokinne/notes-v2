import { Layout } from "../../layouts/Layout";
import { useProtectedRoute } from "../../hooks/use-protected-route";
import { useNotes } from "../../hooks/use-notes";
import toast from "react-hot-toast";
import { useTags } from "../../hooks/use-tags";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Note } from "../../types";
import { Link } from "react-router";

export function NoteIndex() {
    useProtectedRoute()
    const {notes, loading, errors, destroy} = useNotes()
    const { tags } = useTags()
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([])

    if (errors) {
        toast.error(`${errors}`)
    }

    useEffect(() => {
        if (notes) {
            setFilteredNotes(notes.filter((note) => note.in_history !== 1));
        }
    }, [notes]);

    const handleFilter = (e: ChangeEvent<HTMLSelectElement>) => {
        const tagName = e.target.value;

        if (tagName === "all") {
            setFilteredNotes(notes.filter(note => note.in_history !== 1));
            return;
        }

        const filtered = notes.filter(note =>
            note.tags?.some(tag => tag.name === tagName)
        );

        setFilteredNotes(filtered);
    };

    const handleDelete = async (id: number) => {
        await destroy(id.toString())
        setFilteredNotes(filteredNotes.filter((note: Note) => note.id !== id))
    }
    return (
        <>
            <Layout>
                <section className="grid place-items-center h-screen w-full">
                    <div className="flex flex-col justify-between items-start gap-10 w-[1000px]">
                        <select name="tag" id="tag" onChange={handleFilter} className="px-4 py-2 bg-slate-100 rounded">
                            <option value="all">All</option>
                            {tags.map((tag) => (
                                <option value={tag.name}>{tag.name}</option>
                            ))}
                        </select>

                        <div className="grid place-items-center grid lg:grid-cols-2 xl:grid-cols-3 gap-20">
                            {loading ? (
                                <p>Loading...</p>
                            ) : filteredNotes.length > 0 ? (
                                    filteredNotes.map((note) => (
                                        <article className="border-1 border-gray-400 grid place-items-center h-[100px] w-[350px] rounded p-4" key={note.id}>
                                            <div className="flex justify-between w-full">
                                                <Link to={`/notes/${note.id}/show`}>
                                                    <h2>{note.title}</h2>
                                                </Link>
                                                <button onClick={() => handleDelete(note.id)} className="bg-black cursor-pointer text-white p-1 rounded">x</button>
                                            </div>
                                            <div className="flex gap-4">
                                                {note.tags.map((tag) => (
                                                    <p className="bg-black text-white px-4 py" key={tag.id}>{tag.name}</p>
                                                ))}
                                            </div>
                                        </article>
                                    ))
                            ) : (
                                <p>No notes</p>
                            )}
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    )
}
