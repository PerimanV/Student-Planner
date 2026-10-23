import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import Courses from "./pages/Courses";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";

function Layout() {
    return <Outlet />;
}

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Dashboard /> },
            { path: "/tasks", element: <Tasks /> },
            { path: "/calendar", element: <Calendar /> },
            { path: "/courses", element: <Courses /> },
            { path: "/notes", element: <Notes /> },
            { path: "/profile", element: <Profile /> },
            { path: "/register", element: <Register /> },
            { path: "/login", element: <Login /> },
            { path: "*", element: <NotFound /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
