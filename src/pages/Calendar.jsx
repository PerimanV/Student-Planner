import Header from '../components/Header'
import { useState, useEffect } from 'react';

function Calendar() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');

        if(savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    function previousMonth() {
        setCurrentDate(new Date(currentYear, currentMonthIndex - 1, 1)); //reduce current month by 1
    }

    function nextMonth() {
        setCurrentDate(new Date(currentYear, currentMonthIndex + 1, 1)) //increase current month by 1
    }

    function selectDay(date) {
        setSelectedDay(date);
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

    const days = ["Mon","Tue","Wed","Thu","Fri", "Sat", "Sun"]
    const dates = []
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState();
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
    const currentMonth = months[currentDate.getMonth()]; //returns the inde of the month
    const currentYear = currentDate.getFullYear()
    const currentMonthIndex = currentDate.getMonth();
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate(); //get the 0th day of the month (the last day of the previous month, 30 or 31 )
    const startDay = new Date(currentYear, currentMonthIndex, 1).getDay();  //the day the month starts (depending on the month)

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
                    const cellDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
                    const tasksForDay = tasks.filter(task => task.dueDate === cellDate) //tasks for each cell

                    //color the current day green and color clicked day blue
                    return (
                            <div key={date} onClick={() => selectDay(date)} className={`min-h-32 rounded-xl p-2 hover:bg-gray-800 transition-colors cursor-pointer
                                        ${
                                            isSelected
                                                ? "ring-2 ring-blue-500"
                                                : isToday
                                                ? "bg-emerald-900"
                                                : "bg-gray-900"
                                        }
                                    `}>
                                <p className="font-bold">
                                    {date}
                                </p>

                                {/* render the tasks of each day */}
                                {tasksForDay.map(task => (
                                    <div key={task.id} className="mt-1 text-s px-2 py-1 truncate flex">
                                        <div className={`w-2 h-2 m-2 rounded-full ${setPrtiorityColor(task.priority)}`}></div> {task.title}
                                    </div>
                                ))}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Calendar