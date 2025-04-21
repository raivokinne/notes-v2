import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContextValue } from "../types";
import { User } from "../types";
import toast from "react-hot-toast";
import { api } from "../utils/api";
import { storage } from "../utils/storage";

type AuthProviderProps = {
    children: React.ReactNode
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    authenticated: false,
    login: async () => {},
    register: async () => {},
    logout: async () => {}
})

export function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [authenticated, setAuthenticated] = useState<boolean>(storage.get("token") ? true : false)

    async function fetchUser() {
        try {
            const res = await api.get("auth/user")
            if (res.status === 200) {
                setUser(res.data)
            } 
        } catch (errors) {
            console.error(errors)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const login = useCallback(async (credentials: any) => {
        try {
            const res = await api.post("guest/login", credentials)
            if (res.data.status === 200) {
                storage.set("token", res.data.token)
                toast.success(res.data.message)
                setAuthenticated(true)
                await fetchUser()
            } else {
                toast.error(res.data.errors || res.data.message)
                setAuthenticated(false)
            }

        } catch (errors) {
            console.error(errors)
            toast.error("Something went wrong")
        }
    }, [])

    const register = useCallback(async (credentials: any) => {
        try {
            const res = await api.post("guest/register", credentials)
            if (res.data.status === 200) {
                storage.set("token", res.data.token)
                toast.success(res.data.message)
                setAuthenticated(true)
                await fetchUser()
            } else {
                toast.error(res.data.errors || res.data.message)
                setAuthenticated(false)
            }
        } catch (errors) {
            console.error(errors)
            toast.error("Something went wrong")
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            await api.post("auth/logout");
            storage.remove("token");
            setUser(null);
            setAuthenticated(false);
            window.location.href = "/"
        } catch (errors) {
            console.error(errors)
            toast.error("Something went wrong")
        }
    }, [])

    return (
        <AuthContext.Provider value={{user,authenticated,login,register,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)