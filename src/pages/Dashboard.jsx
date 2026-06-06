import { Calendar, BookOpen, ListCheck, Clock3 } from 'lucide-react';
import { useState } from 'react';
import { Link } from "react-router-dom";
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import DeadlineCard from '../components/DeadlineCard';
import ScheduleCard from '../components/ScheduleCard';

function Dashboard() {
    const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  function saveNote() {
    if (!note) return;

    setNotes([...notes, note]);
    setNote("");
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

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      
      <Header />
      <main className="mx-auto max-w-7xl py-10">
        <h1 className="text-center text-6xl font-bold">
          Dashboard
        </h1>

        <section className="grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Courses"
            value={6}
            icon={BookOpen}
          />

          <StatCard
            title="Pending Tasks"
            value={13}
            icon={ListCheck}
          />

          <StatCard
            title="Deadlines"
            value="4"
            icon={Calendar}
          />

          <StatCard title="Progress">
            <ProgressCircle progress={68} />
          </StatCard>
        </section>

        <section className="flex flex-col lg:flex-row text-center gap-4">
          <section className="lg:flex-1">
            <h2 className="text-4xl font-bold">
              Upcoming Deadlines
            </h2>

            <ul className="mt-4 space-y-3">
              <DeadlineCard
                title="Database Assignment"
                duedate="Due Tomorrow"
                priority="High"
              />

              <DeadlineCard
                title="React Project"
                duedate="Due Tomorrow"
                priority="Medium"
              />

              <DeadlineCard
                title="Web Development"
                duedate="Due Tomorrow"
                priority="Low"
              />
            </ul>
          </section>

          <div className="hidden lg:block mx-3 w-0.5 bg-gray-500"></div>

          <section className="ml-2 space-y-4 lg:flex-1">
            <h2 className="text-4xl font-bold">
              Today's Schedule
            </h2>

            <ScheduleCard
              title="Math Class"
              time="09:00 - 11:00"
            />

            <ScheduleCard
              title="Web Development"
              time="11:00 - 13:00"
            />

            <ScheduleCard
              title="Databases"
              time="15:00 - 17:00"
            />
          </section>
        </section>

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

export default Dashboard