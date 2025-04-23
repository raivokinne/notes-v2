import { useEffect, useState } from "react"
import { User } from "../types"
import { api } from "../utils/api"

export const useUsers = () => {
    const [users,setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get("auth/users")
                if (res.data.status === 200) {
                    setUsers(res.data.users)
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
		users,
        errors,
        loading,
    }
}

