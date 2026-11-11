
import { useState } from "react";
import { Link } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const { data, error } = await authClient.requestPasswordReset({
                email,
                redirectTo: "http://localhost:5173/reset-password"
            });

            if (error) {
                setError(error.message || "Failed to send reset email.");
                return;
            }

            setSuccess("If an account exists with this email, a password reset link will be sent.");
        } catch (err) {
            console.error("Password reset request error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">

                <h1 className="text-3xl font-bold text-center">
                    Forgot Password?
                </h1>

                <p className="mt-3 text-center text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
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

                    {error && (
                        <p role="alert" className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p role="status" className="text-sm text-emerald-400">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-emerald-600 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Back to login
                    </Link>
                </p>
            </div>
        </main>
    );
}
