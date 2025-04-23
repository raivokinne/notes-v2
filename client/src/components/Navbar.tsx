import { Link } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import { FormEvent, useEffect, useState } from "react";
import { useNotes } from "../hooks/use-notes";
import { Popup } from "./Popup";
import { SharedNote } from "../types";

export function Navbar() {
    const { authenticated, user, logout } = useAuth()
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { sharedNotes } = useNotes()
	const [shares, setShares] = useState<SharedNote[]>([])
    const onsubmit = async (e: FormEvent) => {
        e.preventDefault()
        await logout()
    }
	useEffect(() => {
		async function fetchData() {
			const data = await sharedNotes()
			setShares(data)
		}
		fetchData()
	}, [])
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
                        {authenticated && (
                            <>
                                <li>
                                    <Link to="/notes">Notes</Link>
                                </li>
                                <li>
                                    <Link to="/history">History</Link>
                                </li>

                            </>
                        )}
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
                                <div className="flex items-center w-[120px]">
                                    <button
                                        onClick={() => setIsOpen(true)}
                                        className="w-full px-3 py-1 bg-black rounded-md text-white"
                                    >
										Notifications
                                    </button>
								</div>
								<Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h2 className="text-xl font-bold text-gray-800">Popup Title</h2>
											<button
												className="text-gray-400"
												onClick={() => setIsOpen(false)}
												aria-label="Close"
											>
												x
											</button>
										</div>


										<div className="grid gap-4">
											{
												shares.filter((share) => share.user_id === user?.id!).map((share) => (
													<>
														<Link to={`/notes/${share.note.id}/show`} className="w-full bg-black rounded text-white">
															{share.note.title}
														</Link>
													</>
												))
											}
										</div>

										<div className="flex justify-end pt-2">
											<button
												className="bg-black text-white py-2 px-4 rounded"
												onClick={() => setIsOpen(false)}
											>
												Close
											</button>
										</div>
									</div>
								</Popup>
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
