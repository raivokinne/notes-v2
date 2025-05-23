import { useEffect, useState } from "react"
import { Tag } from "../types"
import { api } from "../utils/api"

export const useTags = () => {
    const [tags,setTags] = useState<Tag[]>([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get("auth/tags")
                if (res.data.status === 200) {
                    setTags(res.data.tags)
                }
            } catch (errors) {
                setErrors(errors as Error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return {
        tags,
        errors,
        loading,
    }
}
