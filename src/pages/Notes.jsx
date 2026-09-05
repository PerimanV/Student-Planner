import Header from '../components/Header';
import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react'

function Notes() { 
    const [courses, setCourses] = useState(() => {
        const savedCourses = localStorage.getItem("courses");

        if (savedCourses) {
            return JSON.parse(savedCourses);
        } else {
            return [];
        }
    }) 
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem("notes");

        if (savedNotes) {
            return JSON.parse(savedNotes);
        } else {
            return [];
        }
    })
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const courseColors = {
        blue: "bg-blue-600",
        green: "bg-emerald-600",
        purple: "bg-purple-600",
        orange: "bg-orange-600",
        red: "bg-red-600"
    }
    const courseButtonColors = {
    blue: "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/40 font-semibold",
    green: "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-500/40 font-semibold",
    purple: "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/40 font-semibold",
    orange: "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border-orange-500/40 font-semibold",
    red: "bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-500/40 font-semibold"
};
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-10">
                 <div className="flex gap-3 mt-8 flex-wrap">
                    <div className="flex flex-col gap-4 w-full">
                        {courses.map(course => (
                           <div
                                key={course.courseName}
                                className={`w-full rounded-2xl transition-all duration-200 border border-gray-800 bg-gray-900 overflow-hidden ${
                                    selectedCourse?.courseName === course.courseName
                                        ? "ring-2 ring-white"
                                        : ""
                                }`}
                            >
                                <div
                                    onClick={() =>
                                        setSelectedCourse(
                                            selectedCourse?.courseName === course.courseName
                                                ? null
                                                : course
                                        )
                                    }
                                    className="w-full p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center justify-between">

                                        {/* Course information */}
                                        <div className="flex items-center gap-4 text-left">

                                            <div
                                                className={`w-2 h-12 rounded-full ${
                                                    courseColors[course.courseColor]
                                                }`}
                                            ></div>

                                            <div>
                                                <h2 className="text-2xl font-semibold">
                                                    {course.courseName}
                                                </h2>

                                                <p className="text-gray-400 text-sm mt-1">
                                                    0 notes
                                                </p>
                                            </div>

                                        </div>

                                        {/* Right side */}
                                        <div className="flex items-center gap-3">

                                            {/* Add Note */}
                                            <button
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setSelectedCourse(course);
                                                    setShowModal(true);
                                                }}
                                                className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-colors cursor-pointer border ${
                                                    courseButtonColors[course.courseColor]
                                                }`}
                                            >
                                                <Plus size={18} />
                                                Add Note
                                            </button>

                                            {/* Arrow */}
                                            <ChevronDown
                                                className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                                                    selectedCourse?.courseName === course.courseName
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />

                                        </div>

                                    </div>
                                </div>

                                {/* Expanded section */}
                                {selectedCourse?.courseName === course.courseName && (
                                    <div className="px-4 pb-4">
                                        <div className="border-t border-gray-800 pt-4">

                                            {/* Notes will go here */}

                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    </div>
            </main>
        </div>
    );
}

export default Notes;