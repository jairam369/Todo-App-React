
import React from 'react'
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
} from 'lucide-react'

const Sidebar = ({ page = 'dashboard', onNavigate }) => {
  const items = [
    { label: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
    { label: 'Create Task', page: 'create', icon: PlusCircle },
  ]

  return (
    <aside className="w-full shrink-0 border-b border-gray-200 bg-white p-3 md:min-h-[calc(100vh-5rem)] md:w-60 md:border-b-0 md:border-r md:p-5">
      <p className="mb-3 hidden px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 md:block">
        Workspace
      </p>

      <nav className="flex gap-2 md:flex-col">
        {items.map(({ label, page: itemPage, icon: Icon }) => (
          <button
            key={itemPage}
            onClick={() => onNavigate(itemPage)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              page === itemPage
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon size={19} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8 hidden rounded-2xl bg-indigo-50 p-4 md:block">
        <CalendarDays className="mb-3 text-indigo-600" size={24} />
        <p className="text-sm font-semibold">Plan your day</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          Schedule your tasks and keep track of what needs to get done.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
