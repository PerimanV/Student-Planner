
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function AuthStatus() {
    const navigate = useNavigate();

    const session = authClient.useSession();

    async function handleLogout() {
        const result = await authClient.signOut();

        if (result.error) {
            console.error("Logout failed:", result.error);
            return;
        }

        navigate("/login");
    }

    if (session.isPending) {
        return <p className="text-gray-400">Checking session...</p>;
    }

    if (!session.data) {
        return (
            <div className="flex gap-4">
                <Link to="/login">Sign in</Link>
                <Link to="/register">Register</Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <p>
                Welcome, {session.data.user.name}
            </p>

            <button
                onClick={handleLogout}
                className="rounded-lg bg-emerald-600 px-4 py-2 hover:bg-emerald-500"
            >
                Log out
            </button>
        </div>
    );
}
