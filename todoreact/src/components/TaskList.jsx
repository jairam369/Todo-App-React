
import React from 'react'
import { CalendarDays, Circle, CheckCircle2 } from 'lucide-react'

const priorityStyles = {
  High: 'bg-red-50 text-red-600',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-green-50 text-green-700',
}

const TaskList = ({ tasks, onToggle }) => {
  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <CheckCircle2 size={24} />
        </div>
        <p className="font-medium text-gray-700">No tasks found</p>
        <p className="mt-1 text-sm text-gray-400">
          Try another filter or add a new task.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start gap-3 py-4 first:pt-2 last:pb-2"
        >
          <button
            onClick={() => onToggle(task.id)}
            aria-label={
              task.completed ? 'Mark task incomplete' : 'Complete task'
            }
            className={`mt-0.5 shrink-0 ${
              task.completed
                ? 'text-indigo-600'
                : 'text-gray-300 hover:text-indigo-600'
            }`}
          >
            {task.completed
              ? <CheckCircle2 size={21} />
              : <Circle size={21} />}
          </button>

          <div className="min-w-0 flex-1">
            <p
              className={`break-words text-sm font-medium ${
                task.completed
                  ? 'text-gray-400 line-through'
                  : 'text-gray-800'
              }`}
            >
              {task.title}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
              <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-500">
                {task.category}
              </span>

              {task.dueDate && (
                <span className="flex items-center gap-1">
                  <CalendarDays size={13} />
                  {task.dueDate}
                </span>
              )}
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
              priorityStyles[task.priority] || priorityStyles.Medium
            }`}
          >
            {task.priority}
          </span>
        </div>
      ))}
    </div>
  )
}

export default TaskList
