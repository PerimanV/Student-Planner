import { CheckCircle, Circle,Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

function CourseCard({
    course,
    color,
    tasks,
    completed,
    pending,
    onEdit,
    onDelete
}) {
    const courseColors = {
        blue: "bg-blue-700",
        green: "bg-emerald-700",
        purple: "bg-purple-700",
        orange: "bg-orange-700",
        red: "bg-red-700"
    }
    const [expanded, setExpanded] = useState(false);
    return (
        <div onClick={() => setExpanded(!expanded)} className="bg-gray-900 rounded-xl cursor-pointer">
            <h2 className={`${courseColors[color]} flex justify-between gap-3 rounded-t-xl p-3 text-2xl text-center`}>
                <button
                    onClick={() => {
                        event.stopPropagation();
                        onEdit();
                    }}
                    className="p-2 text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                    title="Edit course"
                >
                    <Pencil size={20} />
                </button>
                <div>{course}</div>
                <button
                    onClick={() => {
                        event.stopPropagation();
                        onDelete();
                    }}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete course"
                >
                    <Trash2 size={20} />
                </button>
            </h2>
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Completed</span>
                </div>

                <span className="text-2xl font-bold">
                    {completed}
                </span>
            </div>

            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span>Pending</span>
                </div>

                <span className="text-2xl font-bold">
                    {pending}
                </span>
            </div>
            {/* TODO: make this look better */}
            {expanded && (
    <div className="px-3 pb-3">

        <div className="border-t border-gray-800 pt-3">

            {tasks.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                    No tasks for this course.
                </p>
            ) : (
                tasks.map(task => (
                    <div
                        key={task.id}
                        className="bg-gray-950 rounded-xl p-3 mb-2 flex items-center justify-between hover:bg-gray-800 transition-colors"
                    >

                        <div className="flex items-center gap-3 min-w-0">

                            {task.completed ? (
                                <CheckCircle
                                    className="text-green-500 shrink-0"
                                    size={20}
                                />
                            ) : (
                                <Circle
                                    className="text-orange-500 shrink-0"
                                    size={20}
                                />
                            )}

                            <div className="min-w-0">
                                <p className="font-medium truncate">
                                    {task.title}
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    Due: {task.dueDate}
                                </p>
                            </div>

                        </div>

                        <span
                            className={`text-xs px-2 py-1 rounded-lg ml-3 shrink-0 ${
                                task.priority === "High"
                                    ? "bg-red-900 text-red-300"
                                    : task.priority === "Medium"
                                    ? "bg-yellow-900 text-yellow-300"
                                    : "bg-green-900 text-green-300"
                            }`}
                        >
                            {task.priority}
                        </span>

                                </div>
                            ))
                        )}

                    </div>

                </div>
            )}
        </div>
    );
}

export default CourseCard