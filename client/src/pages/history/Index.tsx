import { Layout } from "../../layouts/Layout";
import { useProtectedRoute } from "../../hooks/use-protected-route";
import toast from "react-hot-toast";
import { useHistory } from "../../hooks/use-history";
import { useEffect, useState } from "react";
import { History } from "../../types";

export function Index() {
    useProtectedRoute()
    const {data, loading, errors} = useHistory()
	const [fillterdData, setFillterdData] = useState<History[]>([])

    if (errors) {
        toast.error(`${errors}`)
    }

	useEffect(() => {
		const now = new Date();

		const updatedData = data.filter((history) => {
			const expiresDate = new Date(history.expires);
			const diffInDays = (now - expiresDate) / (1000 * 60 * 60 * 24);
			return diffInDays < 30;
		});
		setFillterdData(updatedData);
	}, [data]);

    return (
        <>
            <Layout>
                <section className="grid place-items-center h-screen w-full">
                    <div className="flex flex-col justify-between items-start gap-10 w-[800px]">
                        <div className="grid place-items-center grid-cols-3 gap-10">
                            {loading ? (
                                <p>Loading...</p>
                            ) : fillterdData.length > 0 ? (
                                    fillterdData.map((history) => (
                                        <article className="border-1 border-gray-400 grid place-items-center h-[100px] w-[250px] rounded p-4" key={history.id}>
                                            <div className="flex justify-between w-full">
                                                <h2>{history.note.title}</h2>
                                            </div>
                                            <div className="flex gap-4">
                                                {history.note.tags.map((tag) => (
                                                    <p className="bg-black text-white px-4 py" key={tag.id}>{tag.name}</p>
                                                ))}
                                            </div>
                                        </article>
                                    ))
                            ) : (
                                <p>No notes</p>
                            )}
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    )
}
