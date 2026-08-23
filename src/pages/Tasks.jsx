import Header from '../components/Header'
import { Link } from "react-router-dom";
import { Plus, X, SquareCheckBig, Square } from 'lucide-react';
import { useEffect, useState } from 'react';

function Tasks() {
    const courseColors = {
        blue: "bg-blue-700",
        green: "bg-emerald-700",
        purple: "bg-purple-700",
        orange: "bg-orange-700",
        red: "bg-red-700"
    }
    const [showModal, setShowModal] = useState(false)
    const [title, setTitle] = useState("")
    const [priority, setPriority] = useState("Medium")
    const [dueDate, setDueDate] = useState("")
    const [error, setError] = useState("")
    const [courses, setCourses] = useState(() => {
    const savedCourses = localStorage.getItem("courses");
        if(savedCourses) {
            return JSON.parse(savedCourses)
        }
        else {
            return []
        }
    })
    const [course, setCourse] = useState(courses[0]?.courseName || "");

    //initialize tasks from localstorage if any exist
    const [tasks, setTasks] = useState((() => {
        const savedTasks = localStorage.getItem('tasks')

        if (savedTasks) {
            return JSON.parse(savedTasks)
        }
        else {
            return []
        }
    }))

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    function addTask() {

        if (!title) {
            setError("Title is required")
            return
        }
        setError("")

        const newTask = {
            id: Date.now(),
            title,
            course,
            priority,
            dueDate,
            completed: false
        }

        setTasks([...tasks, newTask])
        closeModal()
        setTitle('')
        setCourse(courses[0]?.courseName || "")
        setPriority("Medium")
        setDueDate('')
    }

    function closeModal() {
        setShowModal(false)

        setTitle('')
        setCourse(courses[0]?.courseName || "")
        setPriority('Medium')
        setDueDate('')
        setError('')
    }      

    function deleteTask(id) {
        setTasks(tasks.filter(task => task.id !== id))
    }

    function toggleTask(id) {
        const updatedTasks = [...tasks]
        const task = updatedTasks.find(task => task.id === id)

        // toggle task completion (checkbox)
        task.completed = !task.completed
        setTasks(updatedTasks)    
    }

    function setPrtiorityColor(priority) {
        let priorityColor = "";

        if (priority === "High") {
            priorityColor = "bg-red-600";
        } else if (priority === "Medium") {
            priorityColor = "bg-yellow-600";
        } else {
            priorityColor = "bg-green-600";
        }

        return priorityColor;
    }
    

    return(
        <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
            <Header />
            <main className='mx-auto max-w-7xl px-4 py-10'>
                <section className=''>

                    <button onClick={() => setShowModal(true)} className='mt-8 p-2 flex justify-between w-full cursor-pointer card-hover'>
                        <h3 className='text-3xl font-bold'>Add Task</h3>
                        <div className='cursor-pointer text-emerald-600'> <Plus className='w-10 h-10' strokeWidth={3} /> </div>
                    </button>
                    <div className='mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
                        {courses.map((course, index) => (
                            <div className='rounded-xl bg-gray-900 min-h-125 overflow-hidden' key={index}>
                                <h2 className={`p-3 text-2xl text-center ${courseColors[course.courseColor]} rounded-t-xl`}>
                                    {course.courseName}
                                </h2>
                                {/* display each task in the corresponding course column */}
                                {tasks.filter((task) => task.course == course.courseName).length === 0 && (
                                    <p className='mt-10 text-xl text-center opacity-50'>No tasks yet</p>
                                )}
                                {tasks
                                    .filter((task) => task.course == course.courseName)
                                    .map((task) => (
                                        <div
                                            key={task.id}
                                            className='m-4 p-3 card-hover overflow-hidden'
                                            onContextMenu={(e) => {
                                                e.preventDefault()
                                                deleteTask(task.id)
                                            }}
                                        >

                                        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>

                                            <div className='flex items-start gap-3 min-w-0'>

                                                {task.completed ? (
                                                    <button
                                                        className='cursor-pointer shrink-0'
                                                        onClick={() => toggleTask(task.id)}
                                                    >
                                                        <SquareCheckBig className='w-7 h-7 sm:w-8 sm:h-8'/>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className='cursor-pointer shrink-0'
                                                        onClick={() => toggleTask(task.id)}
                                                    >
                                                        <Square className='w-7 h-7 sm:w-8 sm:h-8'/>
                                                    </button>
                                                )}

                                                <div className='min-w-0'>
                                                    <h3
                                                        className={`text-lg sm:text-xl break-words ${
                                                            task.completed
                                                                ? "line-through opacity-60"
                                                                : ""
                                                        }`}
                                                    >
                                                        {task.title}
                                                    </h3>

                                                    <p className='text-sm text-gray-400'>
                                                        {task.dueDate.split("-").reverse().join("/")}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`self-start sm:self-auto rounded-xl ${setPrtiorityColor(task.priority)} px-3 py-1 text-sm text-white shrink-0`}
                                            >
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                    ))
                                }
                            </div>
                        ))}
                    </div>
                        <h3 className='text-center text-xl opacity-50 mt-4'>Right click to delete a task!</h3>
                </section>

                {showModal && (
                    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4'>
                        <div className='bg-gray-900 rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden'>

                            <div className='flex justify-end'>
                                <button onClick={() => closeModal()}>
                                    <X
                                    className='cursor-pointer w-8 h-8 sm:w-10 sm:h-10 text-red-900 hover:text-red-700 transition-colors'
                                    strokeWidth={3}
                                    />
                                </button>
                            </div>

                            <section className='mt-2 flex flex-col gap-3'>

                                <label className='text-sm text-gray-300'>
                                    Task Title
                                </label>

                                <input
                                    type='text'
                                    required
                                    placeholder="Type a title..."
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-600 transition-colors"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />

                                {error && (
                                    <p className="text-red-700 text-sm">
                                    {error}
                                    </p>
                                )}

                                <label className='text-sm text-gray-300'>
                                    Course
                                </label>

                                <select
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-600 transition-colors"
                                >
                                    {courses.map((course) => (
                                    <option key={course.courseName} value={course.courseName}>
                                        {course.courseName}
                                    </option>
                                    ))}
                                </select>

                                {/* {courses.map((course) => (
                                    <p>
                                        {course.courseName}
                                    </p>
                                ))} */}

                                <label className='text-sm text-gray-300'>
                                    Priority
                                </label>

                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-600 transition-colors"
                                >
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>

                                <label className='text-sm text-gray-300'>
                                    Due Date
                                </label>

                                <input
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-600 transition-colors"
                                    type='date'
                                />

                                <button
                                    className='mt-2 transition-all duration-200 w-full cursor-pointer hover:bg-emerald-800 active:bg-emerald-700 bg-emerald-900 rounded-xl px-4 py-3 font-semibold'
                                    type='submit'
                                    onClick={addTask}
                                >
                                    Add Task
                                </button>
                            </section>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Tasks