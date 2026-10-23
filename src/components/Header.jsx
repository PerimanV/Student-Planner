import { Link, useLocation } from "react-router-dom";
import { Blobatar } from "@blobatar/react";
import "blobatar/motion.css";
import { useEffect } from 'react';
import { useProfile } from "../context/ProfileContext";

function Header() {
    const location = useLocation();

    const { profile, loading } = useProfile();

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/profile",
                    {
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load profile");
                }

                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error("Error loading header profile:", error);
            }
        }

        loadProfile();
    }, []);

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/courses", label: "Courses" },
        { path: "/calendar", label: "Calendar" },
        { path: "/tasks", label: "Tasks" },
        { path: "/notes", label: "Notes" },
        { path: "/profile", label: "Profile" }
    ];

    return (
        <header className="px-4 pt-4">
            <div className="max-w-7xl mx-auto bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl px-4 py-3 flex items-center justify-between">

                <nav>
                    <ul className="flex gap-x-4 tracking-wider">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                                        location.pathname === link.path
                                            ? "bg-emerald-500/15 text-emerald-300"
                                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <Link
                    to="/profile"
                    className="flex items-center gap-3"
                >
                    <span className="text-lg font-medium">
                        {loading ? "Loading..." : profile?.name ?? "User"}
                    </span>

                    {profile && (
                        <Blobatar
                            name={profile.name}
                            animate="hover"
                            className="w-10"
                            traits={{ tone: 0.71 }}
                        />
                    )}
                </Link>

            </div>
        </header>
    );
}

export default Header;