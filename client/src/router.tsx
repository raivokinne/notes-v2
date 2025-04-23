import { createBrowserRouter, RouterProvider } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { NoteIndex } from "./pages/notes/Index";
import { NoteShow } from "./pages/notes/Show";
import { Index } from "./pages/history/Index";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/notes",
        element: <NoteIndex />
    },
    {
        path: "/notes/:id/show",
        element: <NoteShow />
    },
    {
        path: "/history",
        element: <Index/>
    }
])

export const AppRouter = () => <RouterProvider router={router} />