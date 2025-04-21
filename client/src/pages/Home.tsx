import { Layout } from "../layouts/Layout";

export function Home() {
    return (
        <Layout>
            <section className="grid place-items-center h-screen w-full">
                <article>
                    <h3 className="font-bold text-5xl text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-600">Your personal note taking app</h3>
                </article>
            </section>
        </Layout>
    )
}