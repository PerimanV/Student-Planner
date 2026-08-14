import { CheckCircle, Circle,Pencil, Trash2 } from 'lucide-react';

function CourseCard({
    course,
    color,
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
    return (
        <div className="bg-gray-900 rounded-lg">
            <h2 className={`${courseColors[color]} flex justify-between gap-3 rounded-t-xl p-3 text-2xl text-center`}>
                <button
                    onClick={onEdit}
                    className="p-2 text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                    title="Edit course"
                >
                    <Pencil size={20} />
                </button>
                <div>{course}</div>
                <button
                    onClick={onDelete}
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
        </div>
    );
}

export default CourseCard