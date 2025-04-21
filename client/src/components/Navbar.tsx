import { Link } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import { FormEvent } from "react";

export function Navbar() {
    const { authenticated, user, logout } = useAuth()
    console.log(authenticated, user)
    const onsubmit = async (e: FormEvent) => {
        e.preventDefault()
        await logout()
    }
    return (
        <>
            <nav className="flex justify-center items-center bg-white border-b-2 border-gray-100 h-[80px] fixed top-0 w-full">
                <div className="container flex justify-between items-center w-full mx-[100px]">
                    <div className="text-3xl font-bold">
                        <h3>Notes</h3>
                    </div>

                    <ul className="flex gap-4">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/notes">Your Notes</Link>
                        </li>
                    </ul>

                    <ul className="flex gap-4">
                        {authenticated ? (
                            <>
                                <li>
                                    <form onSubmit={onsubmit}>
                                        <button >Logout</button>
                                    </form>
                                </li>
                                <li>
                                    <p>Welcome {user?.username}!</p>
                                </li>
                            </>

                        ) : (
                            <>
                                <li>
                                    <Link to="/login">Login</Link>
                                </li>
                                <li>
                                    <Link className="bg-black px-4 py-2 w-[250px] text-white rounded-md" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </>
    )
}