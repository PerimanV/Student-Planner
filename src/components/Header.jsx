import { Link, useLocation } from "react-router-dom";
import { Blobatar } from "@blobatar/react";
import "blobatar/motion.css";
import { useEffect, useState } from 'react';
import "blobatar/motion.css";

function Header() {
    const location = useLocation(); // current page pointer

    const [profile, setProfile] = useState(() => {
            const savedProfile = localStorage.getItem("profile");
    
            if (savedProfile) {
                return JSON.parse(savedProfile);
            } else {
                return {
                    name: "John Varouxis",
                    email: "dit22019@go.uop.gr",
                    university: "University of Peloponnese",
                    department: "Computer Science",
                    year: "4th Year"
                };
            }
        });

    return (
        <header className="px-4 pt-4">
            <div className="max-w-7xl mx-auto bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl px-4 py-3 flex items-center justify-between">

                <nav>
                    <ul className="flex gap-x-4 tracking-wider">

                        <li>
                            <Link
                                to="/"
                                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                                    location.pathname === "/"
                                        ? "bg-emerald-500/15 text-emerald-300"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/courses"
                                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                                    location.pathname === "/courses"
                                        ? "bg-emerald-500/15 text-emerald-300"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                Courses
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/calendar"
                                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                                    location.pathname === "/calendar"
                                        ? "bg-emerald-500/15 text-emerald-300"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                Calendar
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/Tasks"
                                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                                    location.pathname === "/Tasks"
                                        ? "bg-emerald-500/15 text-emerald-300"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                Tasks
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/Notes"
                                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                                    location.pathname === "/Notes"
                                        ? "bg-emerald-500/15 text-emerald-300"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                Notes
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/Profile"
                                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                                    location.pathname === "/Profile"
                                        ? "bg-emerald-500/15 text-emerald-300"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                Profile
                            </Link>
                        </li>

                    </ul>
                </nav>

                <div className="flex items-center gap-3">
                    <span className="text-lg font-medium">
                        Periman
                    </span>

                    <Blobatar
                        name={profile.name}
                        animate="hover"
                        className="w-10"
                        traits={{ tone: 0.71 }}
                    />
                </div>

            </div>
        </header>
    )
}

export default Header;