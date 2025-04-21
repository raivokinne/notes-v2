import { Layout } from "../../layouts/Layout";
import { useProtectedRoute } from "../../hooks/use-protected-route";

export function NoteIndex() {
    useProtectedRoute()
    return (
        <>
            <Layout>
                <h1>Notes</h1>
            </Layout>
        </>
    ) 
}