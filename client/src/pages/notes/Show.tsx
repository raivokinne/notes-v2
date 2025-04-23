import { useParams } from "react-router";
import { useNotes } from "../../hooks/use-notes";
import { Layout } from "../../layouts/Layout";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Note, Tag, User } from "../../types";
import { useTags } from "../../hooks/use-tags";
import toast from "react-hot-toast";
import { useUsers } from "../../hooks/use-users";
import { Popup } from "../../components/Popup";
import { useAuth } from "../../providers/AuthProvider";

export function NoteShow() {
    const {id} = useParams()
    const {show, update, uploadAttachment, share} = useNotes()
	const { users } = useUsers()
	const { user } = useAuth()
    const [note, setNote] = useState<Note>({} as Note)
    const { tags } = useTags()
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const content = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        async function fetchNote() {
          if (id) {
            const data: Note = await show(id);
            setNote(data);
            setSelectedTags(data.tags || []);

            if (content.current) {
              content.current.innerHTML = data.description || "";
            }

            data.attachments?.forEach((img) => {
              insertImage("http://localhost:8000/storage/" + img.path);
            });
          }
        }
        fetchNote();
      }, []);

    const handleNoteInput = (e: React.FormEvent<HTMLDivElement>) => {
        const tmpDiv = document.createElement("div");
        tmpDiv.innerHTML = e.currentTarget.innerHTML;

        const images = tmpDiv.querySelectorAll("img");
        images.forEach((img) => img.remove());

        const description = tmpDiv.innerHTML;

        setNote({
            ...note,
            description,
        });
    };

	const handleShare = async (user: User) => {
		const data = await share(id!, user.id)
		await navigator.clipboard.writeText(data.token);
	}

    const saveNote = async () => {
        try {
            const data = await update({
                ...note,
				user_id: user?.id!,
                tags: selectedTags
            })
            setNote(data)
            toast.success("Changes have been saved")
        } catch {
            toast.error("Failed to save note")
        }
    }

    useEffect(() => {
		if (!note.id) return;
        const timer = setInterval(() => {
            if (note.description && note.id) {
                saveNote()
            }
        }, 30000)

        return () => clearInterval(timer)
    }, [note.description, note.id])

    const removeTag = (tagId: number) => {
        setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId))
    }

    const updateTags = (e: ChangeEvent<HTMLSelectElement>) => {
        const tagName = e.target.value;
        const selectedTag = tags.find((tag: Tag) => tag.name === tagName)
        if (selectedTag) {
            setSelectedTags((prev) => [...prev, selectedTag])
        }
    }

    const insertImage = (url: string) => {
        const img = document.createElement("img");
        img.src = url;
        img.style.maxWidth = "30%";
        img.style.display = "block";
        img.style.margin = "10px 0";
        content.current?.appendChild(img);
    };

    const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith("image/")) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file && note.id) {
                    await uploadAttachment(id!, file);
                }
            }
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        for (const file of files) {
            if (file.type.startsWith("image/") && note.id) {
                await uploadAttachment(id!, file);
            }
        }
    };

    return (
        <>
            <Layout>
                <section className="flex justify-center items-center h-screen w-full">
                    <article className="h-[90%] flex flex-col items-start w-full gap-4 p-20 justify-start">
                        <div className="flex justify-between items-center w-full">
                            <input
                                type="text"
                                value={note.title || ""}
                                onChange={(e) => setNote({ ...note, title: e.target.value })}
                                placeholder="Note Title"
                                className="text-xl font-medium focus:outline-none border-b border-slate-300 pb-1"
                            />

                            <div className="flex gap-10">
                                {tags && tags.length > 0 && (
                                    <div className="flex flex-col">
                                        <select
                                            name="tag"
                                            id="tag"
                                            className="px-4 py-1 bg-slate-50 rounded"
                                            onChange={updateTags}
                                        >
                                            <option value="" disabled>
                                                Select a tag
                                            </option>
                                            {tags.map((tag) => (
                                                <option key={tag.id}>{tag.name}</option>
                                            ))}
                                        </select>

                                        {selectedTags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {selectedTags.map((tag) => (
                                                    <span
                                                        key={tag.id}
                                                        className="text-xs px-2 py-1 rounded flex items-center flex-wrap"
                                                    >
                                                        {tag.name}
                                                        <button
                                                            onClick={() => removeTag(tag.id)}
                                                            className="ml-1 text-blue-800 hover:text-blue-900"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center w-[120px]">
                                    <button
                                        onClick={saveNote}
                                        className="w-full px-3 py-1 bg-black rounded-md text-white"
                                    >
                                        Save
                                    </button>
								</div>
                                <div className="flex items-center w-[120px]">
                                    <button
                                        onClick={() => setIsOpen(true)}
                                        className="w-full px-3 py-1 bg-black rounded-md text-white"
                                    >
										Share
                                    </button>
								</div>
								<Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h2 className="text-xl font-bold text-gray-800">Popup Title</h2>
											<button
												className="text-gray-400"
												onClick={() => setIsOpen(false)}
												aria-label="Close"
											>
												x
											</button>
										</div>

										<p>Click on the user with who you want to share the note</p>

										{
											users.filter((user) => user.id !== note?.user?.id).map((user) => (
												<>
													<button onClick={() => handleShare(user)} className="text-gray-600 bg-black text-white w-full rounded">
														{user.username}
													</button>
												</>
											))
										}

										<div className="flex justify-end pt-2">
											<button
												className="bg-black text-white py-2 px-4 rounded"
												onClick={() => setIsOpen(false)}
											>
												Close
											</button>
										</div>
									</div>
								</Popup>
                            </div>
                        </div>
                        <div
                            ref={content}
                            className="w-full h-full p-4 resize-none border border-gray-300 rounded-lg overflow-auto"
                            contentEditable="true"
                            id="note"
                            onInput={handleNoteInput}
                            onPaste={handlePaste}
                            onDrop={handleDrop}
                        />

                    </article>
                </section>
            </Layout>
        </>
    )
}
