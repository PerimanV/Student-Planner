import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "../lib/auth-client";

function ProtectedRoute() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                Checking session...
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
