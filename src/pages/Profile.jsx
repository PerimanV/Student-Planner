import Header from '../components/Header';
import { Blobatar } from "@blobatar/react";
import "blobatar/motion.css";
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

function Profile() {
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

    const [editingProfile, setEditingProfile] = useState(false);
    const [editName, setEditName] = useState(profile.name);
    const [editEmail, setEditEmail] = useState(profile.email);
    const [editUniversity, setEditUniversity] = useState(profile.university);
    const [editDepartment, setEditDepartment] = useState(profile.department);
    const [editYear, setEditYear] = useState(profile.year);

    useEffect(() => {
        localStorage.setItem("profile", JSON.stringify(profile));
    }, [profile]);

    function saveProfile() {
        setProfile({
            name: editName,
            email: editEmail,
            university: editUniversity,
            department: editDepartment,
            year: editYear
        });

        setEditingProfile(false);
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

                    <button
                        onClick={() => setEditingProfile(true)}
                        className="mt-5 px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        Edit Profile
                    </button>
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
