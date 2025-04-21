import { useEffect, useState } from "react"
import { Note } from "../types"
import toast from "react-hot-toast"
import { api } from "../utils/api"

export const useNotes = () => {
    const [data,setData] = useState<Note>({} as Note)
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get("auth/notes")
                if (res.data.status === 200) {
                    toast.success(res.data.message)
                    setData(res.data.notes)
                } 
            } catch (errors) {
                setErrors(errors as Error)
                toast.error(`${errors}`)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return {
        data,
        errors,
        loading
    }
}