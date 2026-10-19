import Header from '../components/Header'
import { useState, useEffect, useRef } from "react";
import { BookOpen, Bell, CalendarDays, Check, RotateCcw, X } from 'lucide-react';

function Calendar() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const dates = []
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    // load tasks
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/tasks?userId=6ac662242783449c4c5ce6ce")
        .then(response => response.json())
        .then(data => {
            setTasks(data);
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
        });
    }, [])

    const [tasksLoaded, setTasksLoaded] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(false);
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/courses")
        .then(response => response.json())
        .then(data => {
            setCourses(data);
        })
        .catch(error => {
            console.error("Error fetching courses:", error);
        })
    }, [])

    // Reference to the selected day's tasks section
    const selectedDayRef = useRef(null);

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    const courseColors = {
        blue: "bg-blue-700",
        green: "bg-emerald-700",
        purple: "bg-purple-700",
        orange: "bg-orange-700",
        red: "bg-red-700"
    }

    const currentMonth = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear()
    const currentMonthIndex = currentDate.getMonth();
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    // Scroll to the selected day's tasks
    useEffect(() => {
        if (selectedDay !== null && selectedDayRef.current) {
            requestAnimationFrame(() => {
                selectedDayRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        }
    }, [selectedDay]);

    const daysInMonth = new Date(
        currentYear,
        currentMonthIndex + 1,
        0
    ).getDate();

    const startDay = new Date(
        currentYear,
        currentMonthIndex,
        1
    ).getDay();

    const selectedTasks = selectedDay ? getTasksForDay(selectedDay): [];

    function previousMonth() {
        setCurrentDate(
            new Date(
                currentYear,
                currentMonthIndex - 1,
                1
            )
        );
    }

    function nextMonth() {
        setCurrentDate(
            new Date(
                currentYear,
                currentMonthIndex + 1,
                1
            )
        );
    }

    // if the clicked day is clicked again unselect it
    function selectDay(date) {
        if (selectedDay === date) {
            setSelectedDay(null);
        } else {
            setSelectedDay(date);
        }
    }

    function getCourseForTask(task) {
    const course = courses.find(
        course => String(course._id) === String(task.courseId)
    );

    if (!course) {
        console.log("No matching course found");
        console.log("Task courseId:", task.courseId);
        console.log("Available courses:", courses);
    }

    return course;
}

    // display tasks for the current day
    function getTasksForDay(day) {
        const cellDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

        return tasks.filter(
            task => task.dueDate?.slice(0, 10) === cellDate
        );
    }

    async function toggleCompletedTask(id) {
        const updatedTasks = [...tasks]

        const task = updatedTasks.find(
            task => task._id === id
        )

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    completed: !task.completed
                })
            });

            if(!response.ok) {
                throw new Error("Failed to update task");
            }

            const updatedTask = await response.json();

            setTasks(prevTasks => 
                prevTasks.map(task =>
                task._id === id ? updatedTask : task)
            );

            setSelectedTask(updatedTask);
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

    async function saveTask() {
        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${selectedTask._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        courseId: selectedTask.courseId,
                        title: selectedTask.title,
                        priority: selectedTask.priority,
                        dueDate: selectedTask.dueDate || null
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save task");
            }

            const updatedTask = await response.json();

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === updatedTask._id
                        ? updatedTask
                        : task
                )
            );

            setSelectedTask(updatedTask);
            setEditingTask(false);
        } catch (error) {
            console.error("Error saving task:", error);
        }
    }

    for (let i = 1; i <= daysInMonth; i++) {
        dates.push(i);
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
            <Header />

            <main className="mx-auto max-w-7xl px-4 py-10">
                {/* Month selector */}
                <div className="flex justify-center">
                    <div className="flex items-center gap-4 bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl px-4 py-2">
                        <button
                            onClick={previousMonth}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                        >
                            ←
                        </button>

                        <h1 className="text-2xl font-semibold min-w-48 text-center">
                            {currentMonth} {currentYear}
                        </h1>

                        <button
                            onClick={nextMonth}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                        >
                            →
                        </button>
                    </div>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-2 mb-2 mt-8">
                    {days.map((day) => (
                        <div
                            key={day}
                            className="border border-gray-800 rounded-xl bg-gray-900 p-3 text-center font-semibold text-gray-300"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: startDay }).map((_, index) => (
                        <div key={index}></div>
                    ))}

                    {dates.map((date) => {
                        const isToday =
                            date === todayDay &&
                            currentMonthIndex === todayMonth &&
                            todayYear === currentYear

                        const isSelected =
                            selectedDay === date

                        const tasksForDay =
                            getTasksForDay(date);

                        return (
                            <div
                                key={date}
                                onClick={() => selectDay(date)}
                                className={`min-h-24 lg:min-h-32 rounded-xl p-2 border border-gray-800 hover:bg-gray-800 transition-all duration-200 cursor-pointer
                                    ${
                                        isSelected
                                            ? "ring-2 ring-blue-500 bg-gray-900"
                                            : isToday
                                            ? "bg-emerald-900/40 ring-1 ring-emerald-700"
                                            : "bg-gray-900"
                                    }
                                `}
                            >
                                <p className="font-bold text-lg mb-2">
                                    {date}
                                </p>

                                {/* render the tasks of each day */}
                                {tasksForDay.map(task => (
                                    <div
                                        key={task._id}
                                        className="mt-1 text-s px-2 py-1 truncate flex"
                                    >
                                        <div
                                            className={`w-2.5 h-2.5 m-2 rounded-full ${setPrtiorityColor(task.priority)}`}
                                        ></div>

                                        {task.title}
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>

                {/* Selected day tasks */}
                {selectedDay != null &&
                    selectedTasks.length > 0 && (
                        <div
                            ref={selectedDayRef}
                            className="mt-10 bg-gray-900 border border-gray-800 rounded-2xl p-4 scroll-mt-6"
                        >
                            <div className="mt-4">
                                <h2 className="text-2xl font-bold mb-4">
                                    Tasks for {selectedDay} {currentMonth}:
                                </h2>
                            </div>

                            {selectedTasks.map(task => 
                                {
                                    const course = getCourseForTask(task);

                                    return (
                                        <div
                                            key={task._id}
                                            onClick={() => setSelectedTask(task)}
                                            className="bg-gray-950 border border-gray-800 rounded-2xl inline-block p-4 m-2 cursor-pointer hover:bg-gray-800 transition-colors"
                                        >
                                            <p>
                                                Status:

                                                <span
                                                    className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${
                                                        task.completed
                                                            ? "bg-green-900 text-green-100"
                                                            : "bg-red-900 text-red-100"
                                                    }`}
                                                >
                                                    {task.completed
                                                        ? "Completed"
                                                        : "Incomplete"
                                                    }
                                                </span>
                                            </p>

                                            <h2 className="font-bold text-xl mb-2">
                                                {task.title}
                                            </h2>

                                            {/* TODO: fix course color */}
                                            <p
                                                className={`${
                                                    courseColors[course?.courseColor] || "bg-gray-700"
                                                } text-center text-lg rounded-2xl px-2`}
                                            >
                                                {course.courseName}
                                            </p>

                                            <p className="text-gray-400 text-sm mt-2">
                                                Due: {task.dueDate}
                                            </p>
                                        </div>
                                    )
                                })}
                        </div>
                    )
                }

                {/* Task modal */}
                {selectedTask && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => {
                            setSelectedTask(null);
                            setEditingTask(false);
                        }}
                    >
                        <div
                            className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl shadow-black/40"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between border-b border-gray-800 p-6">
                                <div className="min-w-0 flex-1">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                                        {editingTask ? "Edit task" : "Task details"}
                                    </p>

                                    {editingTask ? (
                                        <input
                                            value={selectedTask.title}
                                            onChange={(e) =>
                                                setSelectedTask({
                                                    ...selectedTask,
                                                    title: e.target.value
                                                })
                                            }
                                            placeholder="Task title"
                                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xl font-bold text-white outline-none transition focus:border-emerald-500"
                                        />
                                    ) : (
                                        <h2 className="break-words text-2xl font-bold text-white">
                                            {selectedTask.title}
                                        </h2>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedTask(null);
                                        setEditingTask(false);
                                    }}
                                    className="ml-4 rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                                    aria-label="Close modal"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Task details */}
                            <div className="space-y-5 p-6">

                                {/* Course */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-400">
                                        Course
                                    </label>

                                    {/* if editing task find the course and give its course id */}
                                    {editingTask ? (
                                        <select
                                            value={selectedTask.courseId || ""}
                                            onChange={(e) =>
                                                setSelectedTask({
                                                    ...selectedTask,
                                                    courseId: e.target.value
                                                })
                                            }
                                            className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none transition focus:border-emerald-500"
                                        >
                                            <option value="" disabled>
                                                Select a course
                                            </option>

                                            {courses.map((course) => (
                                                <option key={course._id} value={course._id}>
                                                    {course.courseName}
                                                </option>
                                            ))}
                                        </select>
                                        // if NOT editing task return the course using the courseId
                                    ) : (
                                        (() => {
                                            const course = courses.find(
                                                c => c._id === selectedTask.courseId
                                            );

                                            return (
                                                <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950 p-3">
                                                    <BookOpen className="shrink-0 text-emerald-400" size={21} />

                                                    <span
                                                        className={`rounded-lg px-3 py-1 text-sm font-medium ${
                                                            courseColors[course?.courseColor] || "bg-gray-700"
                                                        }`}
                                                    >
                                                        {course?.courseName || "Unknown course"}
                                                    </span>
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-400">
                                        Priority
                                    </label>

                                    {editingTask ? (
                                        <select
                                            value={selectedTask.priority}
                                            onChange={(e) =>
                                                setSelectedTask({
                                                    ...selectedTask,
                                                    priority: e.target.value
                                                })
                                            }
                                            className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none transition focus:border-emerald-500"
                                        >
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950 p-3">
                                            <Bell className="shrink-0 text-emerald-400" size={21} />

                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                                    selectedTask.priority === "High"
                                                        ? "bg-red-500/15 text-red-400"
                                                        : selectedTask.priority === "Medium"
                                                        ? "bg-yellow-500/15 text-yellow-400"
                                                        : "bg-green-500/15 text-green-400"
                                                }`}
                                            >
                                                {selectedTask.priority}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Due date */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-400">
                                        Due date
                                    </label>

                                    {editingTask ? (
                                        <input
                                            type="date"
                                            value={selectedTask.dueDate?.slice(0, 10) || ""}
                                            onChange={(e) =>
                                                setSelectedTask({
                                                    ...selectedTask,
                                                    dueDate: e.target.value
                                                })
                                            }
                                            className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none transition focus:border-emerald-500"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950 p-3">
                                            <CalendarDays className="shrink-0 text-emerald-400" size={21} />

                                            <span className="text-gray-200">
                                                {selectedTask.dueDate?.slice(0, 10) || "No due date"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Completion status */}
                                <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-950 p-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Status</p>
                                        <p className={`mt-1 font-semibold ${
                                            selectedTask.completed
                                                ? "text-emerald-400"
                                                : "text-red-400"
                                        }`}>
                                            {selectedTask.completed ? "Completed" : "Incomplete"}
                                        </p>
                                    </div>

                                    <span className={`rounded-full p-2 ${
                                        selectedTask.completed
                                            ? "bg-emerald-500/15 text-emerald-400"
                                            : "bg-orange-500/15 text-red-400"
                                    }`}>
                                        {selectedTask.completed
                                            ? <Check size={22} />
                                            : <CalendarDays size={22} />
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-gray-800 bg-gray-950/50 p-6 sm:flex-row sm:justify-between">
                                <button
                                    onClick={() => {
                                        toggleCompletedTask(selectedTask._id);
                                        setSelectedTask(null);
                                        setEditingTask(false);
                                    }}
                                    className= {`inline-flex items-center justify-center gap-2 rounded-xl border  ${selectedTask.completed ? "bg-amber-800 hover:bg-amber-700" : "bg-emerald-700 hover:bg-emerald-600" } border-gray-700 px-4 py-3 font-medium text-gray-200 transition`}
                                >
                                    {selectedTask.completed ? (
                                        <>
                                            <RotateCcw size={18} />
                                            Mark pending
                                        </>
                                    ) : (
                                        <>
                                            <Check size={18} />
                                            Complete task
                                        </>
                                    )}
                                </button>

                                <div className="flex gap-3">

                                    <button
                                        onClick={() => {
                                            if (editingTask) {
                                                saveTask();
                                            } else {
                                                setEditingTask(true);
                                            }
                                        }}
                                        className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] sm:flex-none"
                                    >
                                        {editingTask ? "Save changes" : "Edit task"}
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

export default Calendar;