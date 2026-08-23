import Header from '../components/Header';
import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react'

function Notes() { 
    const [courses, setCourses] = useState(() => {
        const savedCourses = localStorage.getItem("courses");

        if (savedCourses) {
            return JSON.parse(savedCourses);
        }
        else {
            return [];
        }
    }) 
    const [selectedCourse, setSelectedCourse] = useState(null);
    const courseColors = {
        blue: "bg-blue-600",
        green: "bg-emerald-600",
        purple: "bg-purple-600",
        orange: "bg-orange-600",
        red: "bg-red-600"
    }
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-10">
                <button onClick={() => setShowModal(true)} className='mt-8 p-2 flex justify-between w-full cursor-pointer card-hover'>
                        <h3 className='text-3xl font-bold'>Add Note</h3>
                        <div className='cursor-pointer text-emerald-600'> <Plus className='w-10 h-10' strokeWidth={3} /> </div>
                    </button>
                 <div className="flex gap-3 mt-8 flex-wrap">
                    <div className="flex flex-col gap-4 w-full">
                    {courses.map(course => (
                        <button
                            key={course.courseName}
                            onClick={() => setSelectedCourse(course)}
                            className={`p-4 w-full text-left rounded-2xl transition-all duration-200 cursor-pointer border border-gray-800 bg-gray-900 hover:bg-gray-800 ${
                                selectedCourse?.courseName === course.courseName
                                    ? "ring-2 ring-white"
                                    : ""
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
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
                                <ChevronDown
                                    className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                                        selectedCourse?.courseName === course.courseName
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />
                            </div>
                            test
                        </button>
                        ))}
                    </div>
                    </div>
            </main>
        </div>
    );
}

export default Notes;