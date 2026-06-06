import { Calendar, BookOpen, ListCheck, Clock3 } from 'lucide-react';

function DeadlineCard({
  title,
  duedate,
  priority,
}) {
  let priorityColor = "";

  if (priority === "High") {
    priorityColor = "bg-red-600";
  } else if (priority === "Medium") {
    priorityColor = "bg-yellow-600";
  } else {
    priorityColor = "bg-green-600";
  }

  return (
    <li className="mx-3 card-hover p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="sm:text-lg lg:text-xl font-bold">
          {title}
        </span>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 rounded-xl bg-blue-600 px-2 py-1 text-sm text-white">
            <Calendar className="w-5 h-5 text-gray-950" />
            {duedate}
          </span>

          <span
            className={`rounded-xl ${priorityColor} px-2 py-1 text-sm text-white`}
          >
            {priority} Priority
          </span>
        </div>
      </div>
    </li>
  );
}

export default DeadlineCard