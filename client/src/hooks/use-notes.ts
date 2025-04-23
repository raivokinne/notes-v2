import { useCallback, useEffect, useState } from "react"
import { Note, NoteAttachment } from "../types"
import { api } from "../utils/api"
import toast from "react-hot-toast/headless"

export const useNotes = () => {
    const [notes,setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get("auth/notes")
                if (res.data.status === 200) {
                    setNotes(res.data.notes)
                }
            } catch (errors) {
                setErrors(errors as Error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const create = useCallback(async () => {
        try {
            const res = await api.post("auth/notes", {
                title: "New Note",
                description: ""
            })
			if (res.data.status === 200) {
				setNotes([...notes, res.data.note])
				toast.success(res.data.message)
			}
        } catch(error) {
            setErrors(error as Error)
        }
    }, [])

    const show = useCallback(async (id: string) => {
        try {
            const res = await api.get(`auth/notes/${id}`)
            return res.data.note
        } catch (error) {
            setErrors(error as Error)
        }
    }, [])

    const update = useCallback(async (note: Note) => {
        try {
            const res = await api.post(`auth/notes/${note.id}`, {
				...note, _method: "PUT"
            })
        return res.data.note
        } catch (error) {
            setErrors(error as Error)
        }
    }, [])

    const destroy = useCallback(async (id: string) => {
        try {
            await api.post(`auth/notes/${id}`, {
                _method: "DELETE"
            })
        } catch (error) {
            setErrors(error as Error)
        }
    }, [])

    const uploadAttachment = useCallback(async (id: string, file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('note_id', id);
            const res = await api.post(`/auth/note/${id}/attachments`, formData);
            return res.data.noteAttachment as NoteAttachment
        } catch (error) {
            setErrors(error as Error)
        }
    }, [])

    const share = useCallback(async (note_id: string, user_id: number) => {
        try {
            const res = await api.post(`/auth/share`, {
                user_id,
                note_id
            });
            return res.data
        } catch (error) {
            setErrors(error as Error)
        }
    }, [])

    const sharedNotes = useCallback(async () => {
        try {
            const res = await api.get(`/auth/share`);
            return res.data.sharedNotes
        } catch (error) {
            setErrors(error as Error)
        }
    }, [])

    return {
        notes,
        errors,
        loading,
        show,
        create,
        update,
        destroy,
        uploadAttachment,
        share,
		sharedNotes,
    }
}
