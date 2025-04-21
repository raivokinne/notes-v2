import { Navbar } from "../components/Navbar";

export function Layout({children}: {children: React.ReactNode}) {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                {children}
            </main>
        </>
    )
}