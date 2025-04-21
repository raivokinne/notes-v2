import { FormEvent } from "react"
import { Layout } from "../../layouts/Layout"
import { useNavigate } from "react-router"
import { useAuth } from "../../providers/AuthProvider"

export function Register() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const onsubmit = async (e: FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const formDataObj = Object.fromEntries(formData)
        await register(formDataObj)
        navigate("/notes")
    }
    return (
        <>
            <Layout>
                <section className="grid place-items-center h-screen w-full">
                    <form onSubmit={onsubmit} className="space-x-4 space-y-4">
                        <fieldset className="grid gap-4 place-items-center">
                            <legend className="text-2xl font-bold">Register</legend>
                            <div className="flex gap-4 w-[250px]">
                                <div className="grid gap-4">
                                    <label htmlFor="firstname">Firstname</label>
                                    <input type="text" id="firstname" name="firstname" className="border-1 border-black rounded-full px-4 py-1 w-full" />
                                </div>
                                <div className="grid gap-4">
                                    <label htmlFor="lastname">Lastname</label>
                                    <input type="text" id="lastname" name="lastname" className="border-1 border-black rounded-full px-4 py-1 w-full" />
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" name="username" className="border-1 border-black rounded-full px-4 py-1 w-[250px]" />
                            </div>
                            <div className="grid gap-4">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" name="password" className="border-1 border-black rounded-full px-4 py-1 w-[250px]" />
                            </div>
                            <div className="grid gap-4">
                                <label htmlFor="password_confirmation">Confirm Password</label>
                                <input type="password" id="password_confirmation" name="password_confirmation" className="border-1 border-black rounded-full px-4 py-1 w-[250px]" />
                            </div>
                            <button className="bg-black text-white rounded-md px-4 py-2 w-[250px]">Register</button>
                        </fieldset>
                    </form>
                </section>
            </Layout>
        </>
    )
}