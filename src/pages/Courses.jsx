import Header from '../components/Header';
import { Plus, X } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { useState, useEffect } from 'react';

function Courses() {
    const tasksInit = localStorage.getItem("tasks");
    const tasks = tasksInit ? JSON.parse(tasksInit) : [];
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [courses, setCourses] = useState((() => {
        const savedCourses = localStorage.getItem('courses')

        if(savedCourses) {
            return JSON.parse(savedCourses)
        }
        else {
            return []
        }
    }));
    const [courseName, setCourseName] = useState("");
    const [courseColor, setCourseColor] = useState("");
    const [error, setError] = useState("")
    // TODO: add localstorage for course
    // TODO: save course color

    function closeModal() {
        setShowModal(false);

        setCourseName('');
        setCourseColor('');
        setEditingCourse(null);
        setError('');
    }
    
    function addCourse() {
        if (!courseName) {
            setError("Course name is required")
            return
        }

        if (!courseColor) {
            setError("Please select a course color");
            return;
        }

        setError("")

        const newCourse = {
            courseName,
            courseColor 
        }

        setCourses([...courses, newCourse]);
        closeModal()
        setCourseName('');
        setCourseColor('');
    }

    useEffect(() => {
        localStorage.setItem('courses', JSON.stringify(courses));
    }, [courses])

    function editCourse(course) {
        setEditingCourse(course);
        setCourseName(course.courseName);
        setCourseColor(course.courseColor);
        setShowModal(true);
    }

    function saveEditedCourse() {
    const updatedCourses = courses.map(course => {
        if (course === editingCourse) {
            return {...course, courseName: courseName, courseColor: courseColor};
        }
        else {
           return course;
        } 

        setCourses(updatedCourses);
        closeModal();
    });

    setCourses(updatedCourses);
    closeModal();
}

    function deleteCourse(courseToDelete) {
        const updatedCourses = courses.filter(
            course => course !== courseToDelete
        );

        setCourses(updatedCourses);
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <main className="mx-auto max-w-7xl px-4 py-10">
                <button onClick={() => setShowModal(true)} className='mt-8 p-2 flex justify-between w-full cursor-pointer card-hover'>
                        <h3 className='text-3xl font-bold'>Add Course</h3>
                        <div className='cursor-pointer text-emerald-600'> <Plus className='w-10 h-10' strokeWidth={3} /> </div>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
                    {courses.map(course => {
                        const courseTasks = tasks.filter(
                            task => task.course === course.courseName
                        );

                        const completed = courseTasks.filter(
                            task => task.completed
                        ).length;

                        const pending = courseTasks.filter(
                            task => !task.completed
                        ).length;

                        return ( 
                            <CourseCard 
                                key={course.courseName}
                                color={course.courseColor}
                                course={course.courseName}
                                completed={completed}
                                pending={pending}
                                onEdit={() => editCourse(course)}
                                onDelete={() => deleteCourse(course)}
                            />
                        );
                    })}
                </div>
                {showModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

                            <div className="bg-gray-900 rounded-xl p-4 sm:p-6 w-full max-w-md">

                                {/* Close button */}
                                <div className="flex justify-end">
                                    <button onClick={closeModal}>
                                        <X
                                            className="cursor-pointer w-8 h-8 text-red-900 hover:text-red-700 transition-colors"
                                            strokeWidth={3}
                                        />
                                    </button>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold mb-6">
                                    {editingCourse ? "Edit Course" : "Add Course"}
                                </h2>

                                {/* Course name */}
                                <div className="mb-5">
                                    <label className="text-sm text-gray-300">
                                        Course Name
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        placeholder="Type a course name..."
                                        className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-600 transition-colors"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                    />
                                    {error && (
                                        <p className="mt-1 text-red-700 text-sm">
                                        {error}
                                        </p>
                                    )}
                                </div>                                    

                                <div className="mb-5">
                                    <label className="text-sm text-gray-300">
                                        Course Color
                                    </label>

                                    <div className="flex gap-3 mt-3">
                                        <button onClick={() => setCourseColor('blue')} className={`w-8 h-8 rounded-full bg-blue-600 cursor-pointer ${courseColor === 'blue' ? 'ring-2 ring-white' : ''}`}></button>
                                        <button onClick={() => setCourseColor('green')} className={`w-8 h-8 rounded-full bg-emerald-600 cursor-pointer ${courseColor === 'green' ? 'ring-2 ring-white' : ''}`}></button>
                                        <button onClick={() => setCourseColor('purple')} className={`w-8 h-8 rounded-full bg-purple-600 cursor-pointer ${courseColor === 'purple' ? 'ring-2 ring-white' : ''}`}></button>
                                        <button onClick={() => setCourseColor('orange')} className={`w-8 h-8 rounded-full bg-orange-600 cursor-pointer ${courseColor === 'orange' ? 'ring-2 ring-white' : ''}`}></button>
                                        <button onClick={() => setCourseColor('red')} className={`w-8 h-8 rounded-full bg-red-600 cursor-pointer ${courseColor === 'red' ? 'ring-2 ring-white' : ''}`}></button>
                                    </div>
                                </div>
                                 <button
                                    className='mt-2 transition-all duration-200 w-full cursor-pointer hover:bg-emerald-800 active:bg-emerald-700 bg-emerald-900 rounded-xl px-4 py-3 font-semibold'
                                    type='submit'
                                    onClick={editingCourse ? saveEditedCourse : addCourse}
                                >
                                    {editingCourse ? "Save Changes" : "Add Course"}
                                </button>
                            </div>
                        </div>
                    )}
            </main>
        </div>
    )
}

export default Courses;