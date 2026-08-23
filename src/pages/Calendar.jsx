import Header from '../components/Header'
import { useState, useEffect } from 'react';
import { BookOpen, Bell, CalendarDays, Check, RotateCcw } from 'lucide-react';

function Calendar() {
    const days = ["Mon","Tue","Wed","Thu","Fri", "Sat", "Sun"]
    const dates = []
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    // load tasks
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');

        if (savedTasks) {
            return JSON.parse(savedTasks);
        }
        else {
            return [];
        }
    });
    const [tasksLoaded, setTasksLoaded] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(false);
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
    const currentMonth = months[currentDate.getMonth()]; //returns the inde of the month
    const currentYear = currentDate.getFullYear()
    const currentMonthIndex = currentDate.getMonth();
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate(); //get the 0th day of the month (the last day of the previous month, 30 or 31 )
    const startDay = new Date(currentYear, currentMonthIndex, 1).getDay();  //the day the month starts (depending on the month)
    const selectedTasks = selectedDay ? getTasksForDay(selectedDay) : []; //display in detail tasks for the selected day

    //save edited tasks
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks, tasksLoaded]);

    function previousMonth() {
        setCurrentDate(new Date(currentYear, currentMonthIndex - 1, 1)); //reduce current month by 1
    }

    function nextMonth() {
        setCurrentDate(new Date(currentYear, currentMonthIndex + 1, 1)) //increase current month by 1
    }

    //if the clicked day is clicked again unselect it
    function selectDay(date) {
        if (selectedDay == date){
            setSelectedDay(null);
        }
        else {
            setSelectedDay(date);
        }
    }

    // display tasks for the current day
    function getTasksForDay(day) {
        const cellDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

        return tasks.filter(task => task.dueDate === cellDate) //tasks for each cell
    }

    function toggleCompletedTask(id) {
        const updatedTasks = [...tasks]

        const task = updatedTasks.find(task => task.id === id)

        task.completed = !task.completed;

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

    function saveTask() {
        const updatedTasks = tasks.map(task => {
            if(task.id === selectedTask.id) {
                return selectedTask;
            }
            else {
                return task;
            }
        });

        setTasks(updatedTasks);
        setSelectedTask(selectedTask);
        setEditingTask(false);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        dates.push(i);
    }

        return (
        <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden p-4">
            <Header />
            <h1 className="text-center text-2xl">
               <button className="text-3xl hover:text-emerald-400 transition-colors" onClick={previousMonth}>←</button> {currentMonth} {currentYear} <button className="text-3xl hover:text-emerald-400 transition-colors" onClick={nextMonth}>→</button>
            </h1>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-4 mb-4 mt-8">
                {days.map((day) => (
                    <div key={day} className="border border-gray-600 rounded-xl bg-gray-800 p-3 text-center font-bold">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: startDay }).map((_, index) => (
                    <div key={index}></div>
                ))}
                {dates.map((date) => {
                    const isToday = date === todayDay && currentMonthIndex === todayMonth && todayYear === currentYear
                    const isSelected = selectedDay === date
                    const tasksForDay = getTasksForDay(date); //tasks for each cell

                    //color the current day green and color clicked day blue
                    return (
                            <div key={date} onClick={() => {selectDay(date)}} className={`min-h-32 rounded-xl p-2 hover:bg-gray-800 transition-colors cursor-pointer
                                        ${
                                            isSelected
                                                ? "ring-4 ring-blue-500"
                                                : isToday
                                                ? "bg-emerald-900"
                                                : "bg-gray-900"
                                        }
                                    `}>
                                <p className="font-bold text-lg mb-2">
                                    {date}
                                </p>

                                {/* render the tasks of each day */}
                                {tasksForDay.map(task => (
                                    <div key={task.id} className="mt-1 text-s px-2 py-1 truncate flex">
                                        <div className={`w-2.5 h-2.5 m-2 rounded-full ${setPrtiorityColor(task.priority)}`}></div> {task.title}
                                    </div>
                                ))}
                            </div>
                    )
                })}
            </div>
            {
                selectedDay != null &&
                selectedTasks.length > 0 && (
                    <div className='mt-10 bg-gray-800 rounded-2xl p-3'>

                        <div className='mt-10'>
                            <h2 className='text-2xl font-bold mb-4'>
                                Tasks for {selectedDay} {currentMonth}:
                            </h2>
                        </div>

                        {selectedTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => setSelectedTask(task)}
                                className='bg-gray-900 rounded-2xl inline-block p-4 m-3 cursor-pointer'
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
                                        {task.completed ? "Completed" : "Incomplete"}
                                    </span>
                                </p>
                                <h2 className='font-bold text-xl mb-2'>
                                    {task.title}
                                </h2>

                                        {/* TODO: fix course color */}
                                <p
                                    className={`${courseColors[task.course.courseColor]} text-center text-lg rounded-2xl px-2`}
                                >
                                    {task.course}
                                </p>

                                <p className='text-gray-400 text-sm mt-2'>
                                    Due: {task.dueDate}
                                </p>
                            </div>
                        ))}
                    </div>
                )
            }

            {/*--- Task modal ---*/}
            {selectedTask && (
                <div className='fixed inset-0 bg-black/50 flex justify-center items-center'>
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
                    <div className="flex flex-col gap-2">
                        {/* task edit mode */}
                        {editingTask ? (
                            <input 
                                value={selectedTask.title}
                                onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})
                            }
                            className='bg-gray-800 border border-gray-700 rounded-lg p-3'
                            />
                        ) : (
                        <h2 className="text-3xl font-bold mx-2 my-3 mb-8 underline">
                            {selectedTask.title}
                        </h2>
                        )}

                        {editingTask ? (
                            <select 
                                value={selectedTask.course}
                                onChange={(e) => setSelectedTask({...selectedTask, course: e.target.value})
                            }
                            className='bg-gray-800 border border-gray-700 rounded-lg p-2'
                            > 
                                <option value="Math">Math</option>
                                <option value="Databases">Databases</option>
                                <option value="Web Development">Web Development</option>
                            </select>
                        ) : (
                        <div className="flex items-center m-2 gap-3">
                            <BookOpen size={30}/>
                            <span>{selectedTask.course}</span>
                        </div>
                        )}


                        {editingTask ? (
                            <select 
                                value={selectedTask.priority}
                                onChange={(e) => setSelectedTask({...selectedTask, priority: e.target.value})
                            }
                            className='bg-gray-800 border border-gray-700 rounded-lg p-2'
                            > 
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        ) : (
                            <div className="flex items-center m-2 gap-3">
                                <Bell size={30}/>
                                <span>{selectedTask.priority}</span>
                            </div>
                        )}

                        {editingTask ? (
                            <input
                            value={selectedTask.dueDate}
                            onChange={(e) => setDueDate({...selectedTask, dueDate: e.target.value})}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-600 transition-colors"
                            type='date'
                        />
                        ) : (
                            <div className="flex items-center m-2 gap-3">
                                <CalendarDays size={30}/>
                                <span>{selectedTask.dueDate}</span>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
                            <button
                                onClick={() => {
                                    toggleCompletedTask(selectedTask.id)
                                    setSelectedTask(null)
                                }}
                                className="mt-3 bg-green-900 px-1 rounded-xl cursor-pointer"
                            >
                                <div className="flex items-center m-2 gap-3">
                                    <span>{selectedTask.completed ? (
                                        <div className='flex items-center gap-2'>
                                            <RotateCcw size={25} />
                                            <span>Mark as Pending</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Check size={25} />
                                            <span>Mark as Completed</span> 
                                        </div>
                                    )}
                                    </span>
                                </div>

                            </button>

                            <button onClick={() => setEditingTask(!editingTask)}
                                className='mt-3 bg-blue-900 px-4 py-2 rounded-xl cursor-pointer'    
                            >
                                {editingTask ? (
                                    <button 
                                        onClick={saveTask}
                                        className=" bg-blue-900 px-2 py-1 rounded-xl cursor-pointer"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setEditingTask(true)}
                                        className=" bg-blue-900 px-2 py-1 rounded-xl cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                )}
                            </button>

                            <button
                                onClick={() => setSelectedTask(null)}
                                className="mt-3 bg-red-900 px-4 py-2 rounded-xl cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                        
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Calendar