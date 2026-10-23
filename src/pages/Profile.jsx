import Header from '../components/Header';
import { Blobatar } from "@blobatar/react";
import "blobatar/motion.css";
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { useProfile } from "../context/ProfileContext";

function Profile() {
    
    const { profile, setProfile, loading } = useProfile();
    const [editingProfile, setEditingProfile] = useState(false);

    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editUniversity, setEditUniversity] = useState("");
    const [editDepartment, setEditDepartment] = useState("");
    const [editYear, setEditYear] = useState("");

    async function saveProfile() {
        try {
            // Update the name only if it changed.
            if (editName.trim() !== profile.name) {
                const nameResult = await authClient.updateUser({
                    name: editName.trim()
                });

                if (nameResult.error) {
                    throw new Error(nameResult.error.message);
                }
            }

            // Update the email only if it changed.
            if (editEmail.trim().toLowerCase() !== profile.email.toLowerCase()) {
                const emailResult = await authClient.changeEmail({
                    newEmail: editEmail.trim()
                });

                if (emailResult.error) {
                    throw new Error(emailResult.error.message);
                }
            }

            // Save the additional profile fields.
            const response = await fetch(
                "http://localhost:5000/api/profile",
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        university: editUniversity,
                        department: editDepartment,
                        year: editYear
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save profile");
            }

            setProfile({
                ...data,
                name: editName.trim(),
                email: editEmail.trim()
            });

            setEditingProfile(false);
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    }

    function openEditProfile() {
        setEditName(profile.name);
        setEditEmail(profile.email);
        setEditUniversity(profile.university);
        setEditDepartment(profile.department);
        setEditYear(profile.year);

        setEditingProfile(true);
    }

    const navigate = useNavigate();

    async function handleLogout() {
        const result = await authClient.signOut();

        if (result.error) {
            console.error("Logout failed:", result.error);
            return;
        }

        navigate("/login");
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <p className="text-gray-400">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <p>Unable to load your profile. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <main className="mx-auto max-w-7xl px-4 py-10">
                <div className="bg-gray-900 rounded-2xl p-6 flex flex-col items-center">
                    <Blobatar
                        name={profile.name}
                        animate="hover"
                        className="w-30"
                        traits={{ tone: 0.71 }}
                    />

                    <h1 className="text-3xl font-bold mt-4">
                        {profile.name}
                    </h1>

                    <p className="text-gray-400 mt-1">
                        {profile.department}
                    </p>


                    <div className="mt-5 flex items-center gap-3">
                        <button
                            onClick={openEditProfile}
                            className="w-36 rounded-xl bg-gray-800 px-5 py-3 font-semibold text-white transition-colors hover:bg-gray-700 cursor-pointer"
                        >
                            Edit Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-36 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-red-500 cursor-pointer"
                        >
                            Log out
                        </button>
                    </div>

                </div>
                <div className="bg-gray-900 rounded-2xl p-6 mt-6">
                    <h2 className="text-2xl font-bold mb-5">
                        Profile Information
                    </h2>

                    <div className="flex flex-col gap-4">

                        <div>
                            <p className="text-sm text-gray-500">
                                Name
                            </p>
                            <p className="text-lg">
                                {profile.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Email
                            </p>
                            <p className="text-lg">
                                {profile.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                University
                            </p>
                            <p className="text-lg">
                                {profile.university}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Department
                            </p>
                            <p className="text-lg">
                                {profile.department}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Year of Study
                            </p>
                            <p className="text-lg">
                                {profile.year}
                            </p>
                        </div>

                    </div>

                </div>

               {editingProfile && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">

                            <h2 className="text-2xl font-bold">
                                Edit Profile
                            </h2>

                            <button
                                onClick={() => setEditingProfile(false)}
                                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                <X size={22} />
                            </button>

                        </div>

                        <div className="p-6 flex flex-col gap-5">

                            <div>
                                <label className="text-sm text-gray-300">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-600 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-600 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300">
                                    University
                                </label>

                                <input
                                    type="text"
                                    value={editUniversity}
                                    onChange={(e) => setEditUniversity(e.target.value)}
                                    className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-600 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300">
                                    Department
                                </label>

                                <input
                                    type="text"
                                    value={editDepartment}
                                    onChange={(e) => setEditDepartment(e.target.value)}
                                    className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-600 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300">
                                    Year of Study
                                </label>

                                <select
                                    value={editYear}
                                    onChange={(e) => setEditYear(e.target.value)}
                                    className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-600 transition-colors"
                                >
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="5th+ Year">5th+ Year</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">

                                <button
                                    onClick={() => setEditingProfile(false)}
                                    className="px-5 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={saveProfile}
                                    className="px-5 py-3 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-600 active:bg-emerald-800 transition-colors cursor-pointer"
                                >
                                    Save Changes
                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            )}
            </main>
        </div>
    )
}

export default Profile;
