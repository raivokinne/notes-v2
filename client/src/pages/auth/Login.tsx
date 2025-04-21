import { FormEvent } from "react"
import { Layout } from "../../layouts/Layout"
import { useNavigate } from "react-router"
import { useAuth } from "../../providers/AuthProvider"

export function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const onsubmit = async (e: FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const formDataObj = Object.fromEntries(formData)
        await login(formDataObj)
        navigate("/notes")
    }
    return (
        <>
            <Layout>
                <section className="grid place-items-center h-screen w-full">
                    <form onSubmit={onsubmit} className="space-x-4 space-y-4">
                        <fieldset className="grid gap-4 place-items-center">
                            <legend className="text-2xl font-bold">Login</legend>
                            <div className="grid gap-4">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" name="username" className="border-1 border-black rounded-full px-4 py-1 w-[250px]" />
                            </div>
                            <div className="grid gap-4">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" name="password" className="border-1 border-black rounded-full px-4 py-1 w-[250px]" />
                            </div>
                            <button className="bg-black text-white rounded-md px-4 py-2 w-[250px]">Login</button>
                        </fieldset>
                    </form>
                </section>
            </Layout>
        </>
    )
}