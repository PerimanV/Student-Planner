
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const result = await authClient.signUp.email({
                    name,
                    email,
                    password,
                });

            if (result.error) {
                setError(result.error.message || "Registration failed.");
                return;
            }

            navigate("/");
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-center">
                    Create your account
                </h1>

                <p className="mt-2 text-center text-gray-400">
                    Start organizing your studies.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm">
                            Full name
                        </label>
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-emerald-500"
                        />
                    </div>

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
                            onChange={(e) => setEmail(e.target.value)}
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
                            autoComplete="new-password"
                            minLength={8}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="mb-2 block text-sm">
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}
