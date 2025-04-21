import { useEffect } from "react"
import { useAuth } from "../providers/AuthProvider"
import { useNavigate } from "react-router-dom"

export const useProtectedRoute = () => {
    const navigate = useNavigate()
    const { authenticated} = useAuth()

    useEffect(() => {
        if (!authenticated) {
            navigate("/login")
        }
    }, [authenticated, navigate])
}
