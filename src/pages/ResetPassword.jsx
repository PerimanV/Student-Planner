
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!token) {
            setError("Invalid or missing password reset link.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token
            });

            if (error) {
                setError(error.message || "Failed to reset password.");
                return;
            }

            setSuccess("Your password has been changed successfully!");
        } catch (err) {
            console.error("Password reset error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">

                <h1 className="text-3xl font-bold text-center">
                    Reset Password
                </h1>

                {!success && (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm">
                                New password
                            </label>

                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="mb-2 block text-sm">
                                Confirm new password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
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
                            {loading ? "Updating..." : "Reset password"}
                        </button>
                    </form>
                )}

                {success && (
                    <div className="mt-6 space-y-4 text-center">
                        <p role="status" className="text-emerald-400">
                            {success}
                        </p>
                            <Link
                                to="/login"
                                className="inline-block p-2 bg-emerald-700 rounded-2xl hover:bg-emerald-600 transition-colors"
                            >
                                Back to login
                            </Link>
                    </div>
                )}

                {!success && (
                    <p className="mt-6 text-center text-sm text-gray-400">
                        <Link
                            to="/login"
                            className="text-emerald-400 hover:text-emerald-300"
                        >
                            Back to login
                        </Link>
                    </p>
                )}
            </div>
        </main>
    );
}
