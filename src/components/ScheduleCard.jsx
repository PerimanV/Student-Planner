import { Calendar, BookOpen, ListCheck, Clock3 } from 'lucide-react';

function ScheduleCard({ title, time }) {
  return (
    <div className="mx-3 card-hover p-3">
      <div className="border-l-4 pl-3 border-l-blue-600">
        <p className="font-semibold">{title}</p>
        <div className="flex justify-center items-center gap-2">
          <Clock3 className="h-5 w-5" />
          <span className="block font-bold">
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ScheduleCard