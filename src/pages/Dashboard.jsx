import { Calendar, BookOpen, ListCheck } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import DeadlineCard from '../components/DeadlineCard';
import ScheduleCard from '../components/ScheduleCard';

function Dashboard() {
    // Load courses
    const [courses] = useState(() => {
        const savedCourses = localStorage.getItem('courses');

        if (savedCourses) {
            return JSON.parse(savedCourses);
        } else {
            return [];
        }
    });

    // Load tasks
    const [tasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');

        if (savedTasks) {
            return JSON.parse(savedTasks);
        } else {
            return [];
        }
    });

    // Load notes
    const [note, setNote] = useState("");
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem('dashboardNotes');

        if (savedNotes) {
            return JSON.parse(savedNotes);
        } else {
            return [];
        }
    });

    // Calculate task statistics
    const pendingTasks = tasks.filter(
        task => !task.completed
    );

    const completedTasks = tasks.filter(
        task => task.completed
    );

    const progress = tasks.length > 0
        ? Math.round((completedTasks.length / tasks.length) * 100)
        : 0;

    // Get upcoming deadlines (remove tasks that are completed or have no due date)
    const upcomingDeadlines = tasks
        .filter(task => {
            if (!task.dueDate || task.completed) {
                return false;
            }

            //zeroing the hours to compare days correctly
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            return dueDate >= today;
        })
        .sort((a, b) => {
            return new Date(a.dueDate) - new Date(b.dueDate);
        })
        .slice(0, 3);

    function getDeadlineText(dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);

        const difference =
            Math.round((due - today) / (1000 * 60 * 60 * 24));

        if (difference === 0) {
            return "Due Today";
        }

        if (difference === 1) {
            return "Due Tomorrow";
        }

        if (difference < 7) {
            return `Due in ${difference} days`;
        }

        return `Due ${due.toLocaleDateString()}`;
    }

    function ProgressCircle({ progress }) {
        const radius = 28;
        const strokeWidth = 6;

        const circumference = 2 * Math.PI * radius;

        const offset =
            circumference - (progress / 100) * circumference;

        return (
            <div className="relative flex items-center justify-center">
                <svg
                    width="80"
                    height="80"
                    className="-rotate-90"
                >
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="#1f2937"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />

                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="#10b981"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-500"
                    />
                </svg>

                <div className="absolute text-lg font-bold">
                    {progress}%
                </div>
            </div>
        );
    }

    function saveNote() {
        if (!note.trim()) return;

        const updatedNotes = [...notes, note];

        setNotes(updatedNotes);
        localStorage.setItem(
            'dashboardNotes',
            JSON.stringify(updatedNotes)
        );

        setNote("");
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
            <Header />

            <main className="mx-auto max-w-7xl py-10">
                <h1 className="text-center text-6xl font-bold">
                    Dashboard
                </h1>

                {/* Statistics */}
                <section className="grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Courses"
                        value={courses.length}
                        icon={BookOpen}
                    />

                    <StatCard
                        title="Pending Tasks"
                        value={pendingTasks.length}
                        icon={ListCheck}
                    />

                    <StatCard
                        title="Deadlines"
                        value={upcomingDeadlines.length}
                        icon={Calendar}
                    />

                    <StatCard title="Progress">
                        <ProgressCircle progress={progress} />
                    </StatCard>
                </section>

                {/* Deadlines and schedule */}
                <section className="flex flex-col lg:flex-row text-center gap-4">
                    <section className="lg:flex-1">
                        <h2 className="text-4xl font-bold">
                            Upcoming Deadlines
                        </h2>

                        <ul className="mt-4 space-y-3">
                            {upcomingDeadlines.length > 0 ? (
                                upcomingDeadlines.map(task => (
                                    <DeadlineCard
                                        key={task.id}
                                        title={task.title}
                                        duedate={getDeadlineText(task.dueDate)}
                                        priority={task.priority}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 mt-4">
                                    No upcoming deadlines
                                </p>
                            )}
                        </ul>
                    </section>

                    <div className="hidden lg:block mx-3 w-0.5 bg-gray-500"></div>

                    <section className="ml-2 space-y-4 lg:flex-1">
                        <h2 className="text-4xl font-bold">
                            Today's Schedule
                        </h2>

                        <p className="text-gray-500 mt-4">
                            No schedule available
                        </p>
                    </section>
                </section>

                {/* Quick note */}
                <section className="text-center my-4">
                    <h2 className="text-4xl font-bold mb-2">
                        Quick Note
                    </h2>

                    <div className="mx-3 rounded-xl border border-gray-800 bg-gray-900 p-2">
                        <textarea
                            className="min-h-32 w-full transition-all duration-200 rounded-lg bg-gray-800 p-4 outline-none resize-none border border-gray-800 focus:border-emerald-600"
                            placeholder="Write a quick note..."
                            value={note}
                            onChange={(e) =>
                                setNote(e.target.value)
                            }
                        />

                        <div className="space-y-2 mb-3">
                            {notes.map((note, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg bg-gray-800 p-3 text-left"
                                >
                                    {note}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={saveNote}
                            className="transition-all duration-200 w-full cursor-pointer hover:bg-emerald-800 active:bg-emerald-700 bg-emerald-900 rounded-xl px-4 py-2"
                        >
                            Save Note
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;