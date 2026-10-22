
import React, { useMemo, useState } from 'react'
import {
  Plus,
  Search,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Trash2,
  Circle,
  ClipboardList,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'

const formatDate = (dateString) => {
  if (!dateString) return 'No date'
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(
    undefined,
    { day: 'numeric', month: 'short', year: 'numeric' }
  )
}

const getToday = () => {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

const priorityStyles = {
  High: 'bg-red-50 text-red-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-green-50 text-green-700',
}

const Dashboard = ({ tasks, onToggle, onDelete, onNavigate }) => {
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  const today = getToday()

  const completed = tasks.filter((task) => task.completed).length
  const pending = tasks.length - completed
  const todayTasks = tasks.filter(
    (task) => task.scheduledDate === today
  ).length

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const query = search.trim().toLowerCase()

        const matchesSearch =
          task.title.toLowerCase().includes(query) ||
          (task.description || '').toLowerCase().includes(query) ||
          (task.category || '').toLowerCase().includes(query)

        const matchesPriority =
          priorityFilter === 'All' || task.priority === priorityFilter

        let matchesDate = true

        if (dateFilter === 'Today') {
          matchesDate = task.scheduledDate === today
        } else if (dateFilter === 'Upcoming') {
          matchesDate =
            Boolean(task.scheduledDate) &&
            task.scheduledDate > today
        } else if (dateFilter === 'Past due') {
          matchesDate =
            !task.completed &&
            Boolean(task.scheduledDate) &&
            task.scheduledDate < today
        } else if (dateFilter === 'Completed') {
          matchesDate = task.completed
        }

        return matchesSearch && matchesPriority && matchesDate
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return Number(a.completed) - Number(b.completed)
        }

        return (a.scheduledDate || '9999-12-31').localeCompare(
          b.scheduledDate || '9999-12-31'
        )
      })
  }, [tasks, search, dateFilter, priorityFilter, today])

  const stats = [
    {
      label: 'All tasks',
      value: tasks.length,
      icon: ListTodo,
      style: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: "Today's tasks",
      value: todayTasks,
      icon: CalendarDays,
      style: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock3,
      style: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      style: 'bg-green-50 text-green-600',
    },
  ]

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col md:flex-row">
      <Sidebar page="dashboard" onNavigate={onNavigate} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                My To-Do Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Plan your day, track your tasks, and make progress.
              </p>
            </div>

            <button
              onClick={() => onNavigate('create')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Create task
            </button>
          </header>

          {/* Summary cards */}
          <section
            aria-label="Task summary"
            className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4"
          >
            {stats.map(({ label, value, icon: Icon, style }) => (
              <div
                key={label}
                className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-500">{label}</p>
                  <span className={`rounded-xl p-2 ${style}`}>
                    <Icon size={19} />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold sm:text-3xl">
                  {value}
                </p>
              </div>
            ))}
          </section>

          {/* Progress */}
          <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Overall progress</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {completed} of {tasks.length} tasks completed
                </p>
              </div>
              <span className="text-lg font-bold text-indigo-600">
                {progress}%
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Overall task completion"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2.5 overflow-hidden rounded-full bg-gray-100"
            >
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          {/* Task list */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold">Scheduled tasks</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your tasks, organized by scheduled date.
                </p>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search your tasks..."
                  aria-label="Search tasks"
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {['All', 'Today', 'Upcoming', 'Past due', 'Completed'].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setDateFilter(filter)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      dateFilter === filter
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>

            <div className="mb-4">
              <select
                aria-label="Filter by priority"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-indigo-400"
              >
                <option value="All">All priorities</option>
                <option value="High">High priority</option>
                <option value="Medium">Medium priority</option>
                <option value="Low">Low priority</option>
              </select>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredTasks.map((task) => {
                const isOverdue =
                  !task.completed &&
                  task.scheduledDate &&
                  task.scheduledDate < today

                return (
                  <article
                    key={task.id}
                    className="flex items-start gap-3 py-4 first:pt-2 last:pb-2"
                  >
                    <button
                      type="button"
                      onClick={() => onToggle(task.id)}
                      aria-label={
                        task.completed
                          ? `Reopen ${task.title}`
                          : `Complete ${task.title}`
                      }
                      className={`mt-0.5 shrink-0 ${
                        task.completed
                          ? 'text-green-600'
                          : 'text-gray-300 hover:text-indigo-600'
                      }`}
                    >
                      {task.completed
                        ? <CheckCircle2 size={21} />
                        : <Circle size={21} />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`break-words text-sm font-semibold ${
                          task.completed
                            ? 'text-gray-400 line-through'
                            : 'text-gray-800'
                        }`}
                      >
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-500">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-600">
                          {task.category}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 font-medium ${
                            priorityStyles[task.priority] ||
                            priorityStyles.Medium
                          }`}
                        >
                          {task.priority}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 ${
                            isOverdue ? 'font-semibold text-red-600' : 'text-gray-400'
                          }`}
                        >
                          <CalendarDays size={13} />
                          {formatDate(task.scheduledDate)}
                          {isOverdue ? ' · Overdue' : ''}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete "${task.title}"?`)) {
                          onDelete(task.id)
                        }
                      }}
                      aria-label={`Delete ${task.title}`}
                      className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </article>
                )
              })}
            </div>

            {filteredTasks.length === 0 && (
              <div className="px-4 py-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                  <ClipboardList size={27} />
                </div>

                <h3 className="font-semibold text-gray-800">
                  {tasks.length === 0
                    ? 'Your task list is empty'
                    : 'No matching tasks'}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  {tasks.length === 0
                    ? 'Create your first task and choose the date you plan to complete it. It will appear here.'
                    : 'Try changing your date filter, priority, or search term.'}
                </p>

                {tasks.length === 0 && (
                  <button
                    onClick={() => onNavigate('create')}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <Plus size={17} />
                    Create your first task
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
