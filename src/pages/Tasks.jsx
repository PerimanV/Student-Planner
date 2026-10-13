import Header from '../components/Header'
import { Link } from "react-router-dom";
import { Plus, X, SquareCheckBig, Square } from 'lucide-react';
import { useEffect, useState } from 'react';

function Tasks() {
    const courseColors = {
        blue: "bg-blue-700/70",
        green: "bg-emerald-700/70",
        purple: "bg-purple-700/70",
        orange: "bg-orange-700/70",
        red: "bg-red-700/70"
    }
    const [showModal, setShowModal] = useState(false)
    const [title, setTitle] = useState("")
    const [priority, setPriority] = useState("Medium")
    const [dueDate, setDueDate] = useState("")
    const [error, setError] = useState("")
    //initialize courses if any exist
    const [courses, setCourses] = useState([])
    useEffect(() => {
        fetch("http://localhost:5000/api/courses")
        .then(response => response.json())
        .then(data => {
            setCourses(data);
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
        })
    }, [])
    
    const [course, setCourse] = useState(courses[0]?.courseName || "");
    
    useEffect(() => {
        if (courses.length > 0 && !course) {
            setCourse(courses[0].courseName);
        }
    }, [courses, course]);

    //initialize tasks if any exist
    const [tasks, setTasks] = useState([])
    useEffect(() => {
        fetch("http://localhost:5000/api/tasks")
        .then(response => response.json())
        .then(data => {
            setTasks(data);
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
        }) 
    }, [])

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    async function addTask() {

        if (!title) {
            setError("Title is required")
            return
        }
        setError("")

        
        const selectedCourse = courses.find(
            c => c.courseName === course
        );

        if (!selectedCourse) {
            setError("Please select a valid course");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: "6ac662242783449c4c5ce6ce",
                    courseId: selectedCourse?._id,
                    title: title,
                    priority: priority,
                    dueDate: dueDate,
                    completed: false
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            const newTask = await response.json();

            setTasks([...tasks, newTask])
            closeModal()
            setTitle('')
            setCourse(courses[0]?.courseName || "")
            setPriority("Medium")
            setDueDate('')
        } catch (error) {
            console.error("Error creating task:", error)
        }
       
    }

    function closeModal() {
        setShowModal(false)

        setTitle('')
        setCourse(courses[0]?.courseName || "")
        setPriority('Medium')
        setDueDate('')
        setError('')
    }      

    async function deleteTask(id) {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            // remove task from front end
            setTasks(prevTasks =>
                prevTasks.filter(task => task._id !== id)
            );
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    async function toggleTask(id) {
        const updatedTasks = [...tasks]
        const task = tasks.find(task => task._id === id)

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    completed: !task.completed
                }) 
            })

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            const updatedTask = await response.json();
            
            //only replace updated task
            setTasks(prevTasks =>
                prevTasks.map(tsk => {
                    if(tsk._id === id) {
                        return updatedTask
                    } else {
                        return tsk
                    }
                })
            );  
        } catch (error) {
            console.error("Error toggling task:", error);
        } 
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
                                {tasks.filter((task) => task.courseId == course._id).length === 0 && (
                                    <p className='mt-10 text-xl text-center opacity-50'>No tasks yet</p>
                                )}
                                {tasks
                                    .filter((task) => task.courseId == course._id)
                                    .map((task) => (
                                        <div
                                            key={task.id}
                                            className='m-4 p-3 card-hover overflow-hidden'
                                            onContextMenu={(e) => {
                                                e.preventDefault()
                                                deleteTask(task._id)
                                            }}
                                        >

                                        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>

                                            <div className='flex items-start gap-3 min-w-0'>

                                                {task.completed ? (
                                                    <button
                                                        className='cursor-pointer shrink-0'
                                                        onClick={() => toggleTask(task._id)}
                                                    >
                                                        <SquareCheckBig className='w-7 h-7 sm:w-8 sm:h-8'/>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className='cursor-pointer shrink-0'
                                                        onClick={() => toggleTask(task._id)}
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
                                                        {task.dueDate?.slice(0, 10).split("-").reverse().join("/")}
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