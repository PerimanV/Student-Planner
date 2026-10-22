
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await authClient.signIn.email({
                email,
                password,
            });

            if (result.error) {
                setError(result.error.message || "Login failed.");
                return;
            }

            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-center">
                    Welcome back
                </h1>

                <p className="mt-2 text-center text-gray-400">
                    Sign in to your Student Planner.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-emerald-500"
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-emerald-600 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </main>
    );
}
