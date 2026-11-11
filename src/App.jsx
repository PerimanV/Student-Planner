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
import Goals from "./pages/Goals";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { ProfileProvider } from "./context/ProfileContext";

// keep provider loaded in every page to avoid requets
function Layout() {
    return (
        <ProfileProvider>
            <Outlet />
        </ProfileProvider>
    );
}


const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "/", element: <Dashboard /> },
                    { path: "/tasks", element: <Tasks /> },
                    { path: "/calendar", element: <Calendar /> },
                    { path: "/courses", element: <Courses /> },
                    { path: "/notes", element: <Notes /> },
                    { path: "/profile", element: <Profile /> },
                    { path: "/goals", element: <Goals /> },
                ],
            },
            { path: "/register", element: <Register /> },
            { path: "/login", element: <Login /> },
            { path: "/forgot-password", element: <ForgotPassword /> },
            { path: "/reset-password", element: <ResetPassword /> },
            { path: "*", element: <NotFound /> },
        ],
    },
]);


function App() {
    return <RouterProvider router={router} />;
}

export default App;
