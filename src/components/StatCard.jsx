import { Calendar, BookOpen, ListCheck, Clock3 } from 'lucide-react';

function StatCard({
  title,
  value,
  icon: Icon,
  children,
}) {
  return (
    <div className="mx-3 cursor-pointer card-hover p-5">
      {children ? (
        <div className="flex items-center gap-4">
          {children}

          <div>
            <p className="tracking-wider text-2xl font-bold text-gray-300">
              {title}
            </p>
          </div>

        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Icon className="w-12 h-12 text-emerald-400" />

          <div>
            <p className="mt-1 text-3xl font-bold">
              {value}
            </p>

            <p className="text-xl text-gray-300">
              {title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatCard