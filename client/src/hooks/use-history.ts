import { useEffect, useState } from "react"
import { History } from "../types"
import { api } from "../utils/api"

export const useHistory = () => {
    const [data,setData] = useState<History[]>([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get("auth/histories")
                if (res.data.status === 200) {
                    setData(res.data.histories)
                }
            } catch (error) {
                setErrors(error as Error)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return {
        data,
        loading,
        errors
    }
}