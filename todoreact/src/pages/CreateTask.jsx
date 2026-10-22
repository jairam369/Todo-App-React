
import React, { useState } from 'react'
import { ArrowLeft, CalendarDays, Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar'

const getToday = () => {
  const now = new Date()
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  )
  return localDate.toISOString().slice(0, 10)
}

const CreateTask = ({ onCreateTask, onCancel }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledDate, setScheduledDate] = useState(getToday())
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState('Personal')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!title.trim() || !scheduledDate) return

    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      scheduledDate,
      priority,
      category,
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col md:flex-row">
      <Sidebar page="create" onNavigate={(page) => {
        if (page === 'dashboard') onCancel()
      }} />

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={onCancel}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </button>

          <div className="mb-7">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <CalendarDays size={24} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Create a task
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Add a task and schedule when you want to complete it.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
          >
            <div>
              <label
                htmlFor="task-title"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Task title *
              </label>
              <input
                id="task-title"
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="What do you need to do?"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="task-description"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Description
              </label>
              <textarea
                id="task-description"
                rows={4}
                maxLength={1000}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add some details about this task..."
                className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="scheduled-date"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Scheduled date *
                </label>
                <input
                  id="scheduled-date"
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(event) => setScheduledDate(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <p className="mt-2 text-xs text-gray-400">
                  The day you plan to complete this task.
                </p>
              </div>

              <div>
                <label
                  htmlFor="task-priority"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="task-category"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Category
                </label>
                <select
                  id="task-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus size={18} />
                Save task
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateTask
