import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays, Check, CheckCheck, ChevronDown, Circle, ClipboardList,
  Clock3, Command, Filter, Flag, Folder, LayoutDashboard, ListTodo,
  Menu, MoreHorizontal, Pencil, Plus, Search, Sparkles, Target, Trash2,
  TrendingUp, X, AlertCircle, CheckCircle2, CalendarClock, Inbox,
} from 'lucide-react'

const STORAGE_KEY = 'taskflow.tasks.v1'
const CATEGORIES = ['Work', 'Personal', 'Development', 'Health', 'Learning']
const PRIORITIES = ['Low', 'Medium', 'High']
const today = () => new Date().toISOString().slice(0, 10)

const seedTasks = [
  { id: 'seed-1', title: 'Design landing page concept', description: 'Explore a clean layout and define the visual direction.', category: 'Work', priority: 'High', dueDate: today(), completed: false, createdAt: Date.now() - 60000 },
  { id: 'seed-2', title: 'Review React component structure', description: 'Check reusable components and simplify state flow.', category: 'Development', priority: 'Medium', dueDate: today(), completed: false, createdAt: Date.now() - 120000 },
  { id: 'seed-3', title: 'Plan weekly goals', description: 'Choose three meaningful outcomes for this week.', category: 'Personal', priority: 'Low', dueDate: '', completed: true, createdAt: Date.now() - 180000 },
  { id: 'seed-4', title: 'Finish UI inspiration board', description: 'Collect references for typography, spacing, and color.', category: 'Work', priority: 'Medium', dueDate: '', completed: false, createdAt: Date.now() - 240000 },
]

function readTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : seedTasks
  } catch {
    return seedTasks
  }
}

function formatDate(value) {
  if (!value) return 'No due date'
  const date = new Date(`${value}T00:00:00`)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function isOverdue(task) {
  return !task.completed && task.dueDate && task.dueDate < today()
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

function App() {
  const [tasks, setTasks] = useState(readTasks)
  const [activeView, setActiveView] = useState('Dashboard')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All priorities')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)) } catch { /* Storage may be disabled. */ }
  }, [tasks])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length
    const active = tasks.filter(t => !t.completed).length
    const overdue = tasks.filter(isOverdue).length
    return { total: tasks.length, completed, active, overdue, progress: tasks.length ? Math.round((completed / tasks.length) * 100) : 0 }
  }, [tasks])

  const visibleTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesView =
        activeView === 'Dashboard' || activeView === 'All Tasks' ||
        (activeView === 'Today' && task.dueDate === today()) ||
        (activeView === 'Upcoming' && task.dueDate && task.dueDate > today() && !task.completed) ||
        (activeView === 'Completed' && task.completed) ||
        (activeView === 'Overdue' && isOverdue(task)) ||
        (CATEGORIES.includes(activeView) && task.category === activeView)
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || `${task.title} ${task.description} ${task.category}`.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'All' || (statusFilter === 'Completed' ? task.completed : !task.completed)
      const matchesPriority = priorityFilter === 'All priorities' || task.priority === priorityFilter
      const matchesCategory = categoryFilter === 'All categories' || task.category === categoryFilter
      return matchesView && matchesSearch && matchesStatus && matchesPriority && matchesCategory
    }).sort((a, b) => {
      if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed)
      const priority = { High: 0, Medium: 1, Low: 2 }
      if (priority[a.priority] !== priority[b.priority]) return priority[a.priority] - priority[b.priority]
      return (a.dueDate || '9999-99-99').localeCompare(b.dueDate || '9999-99-99')
    })
  }, [tasks, activeView, search, statusFilter, priorityFilter, categoryFilter])

  function openCreate() {
    setEditingTask(null)
    setModalOpen(true)
  }

  function saveTask(form) {
    if (editingTask) {
      setTasks(current => current.map(task => task.id === editingTask.id ? { ...task, ...form } : task))
      setToast('Task updated successfully')
    } else {
      setTasks(current => [{ ...form, id: crypto.randomUUID?.() || String(Date.now()), completed: false, createdAt: Date.now() }, ...current])
      setToast('Task created successfully')
    }
    setModalOpen(false)
    setEditingTask(null)
  }

  function toggleTask(id) {
    setTasks(current => current.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
    const task = tasks.find(item => item.id === id)
    setToast(task?.completed ? 'Task marked as active' : 'Nice work — task completed')
  }

  function deleteTask(id) {
    setTasks(current => current.filter(task => task.id !== id))
    setToast('Task deleted')
  }

  function editTask(task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, count: null },
    { label: 'All Tasks', icon: ListTodo, count: tasks.length },
    { label: 'Today', icon: CalendarDays, count: tasks.filter(t => t.dueDate === today() && !t.completed).length },
    { label: 'Upcoming', icon: CalendarClock, count: tasks.filter(t => t.dueDate > today() && !t.completed).length },
    { label: 'Completed', icon: CheckCheck, count: stats.completed },
    { label: 'Overdue', icon: AlertCircle, count: stats.overdue },
  ]

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      {mobileNavOpen && <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-slate-950/35 md:hidden" onClick={() => setMobileNavOpen(false)} />}
      <aside className={cx(
        'fixed inset-y-0 left-0 z-40 flex w-[min(86vw,280px)] flex-col overflow-y-auto border-r border-slate-200/80 bg-white px-5 py-6 transition-transform md:w-[260px] md:translate-x-0',
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200"><CheckCheck size={22} /></div>
          <div><p className="text-lg font-extrabold tracking-tight text-slate-900">TaskFlow</p><p className="text-[10px] font-bold tracking-[.18em] text-slate-400">PERSONAL WORKSPACE</p></div>
          <button className="ml-auto rounded-lg p-1 text-slate-400 hover:bg-slate-100 md:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><X size={18}/></button>
        </div>

        <button onClick={() => { openCreate(); setMobileNavOpen(false) }} className="mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700">
          <Plus size={18} /> Create new task
        </button>

        <div className="mt-8">
          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[.17em] text-slate-400">Workspace</p>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon, count }) => (
              <NavButton key={label} label={label} Icon={Icon} count={count} active={activeView === label} onClick={() => { setActiveView(label); setMobileNavOpen(false) }} />
            ))}
          </nav>
        </div>

        <div className="mt-8">
          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[.17em] text-slate-400">Categories</p>
          <div className="space-y-1">
            {CATEGORIES.map((category, index) => {
              const colors = ['bg-sky-400', 'bg-rose-400', 'bg-violet-400', 'bg-emerald-400', 'bg-amber-400']
              return <button key={category} onClick={() => { setActiveView(category); setMobileNavOpen(false) }} className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition', activeView === category ? 'bg-violet-50 font-semibold text-violet-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800')}><span className={cx('h-2.5 w-2.5 rounded-full', colors[index])}/><span className="flex-1">{category}</span><span className="text-xs text-slate-400">{tasks.filter(t => t.category === category && !t.completed).length}</span></button>
            })}
          </div>
        </div>

        <div className="mt-auto rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm"><Sparkles size={18}/></div>
          <p className="text-sm font-bold text-slate-800">Small steps, big wins.</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">A little progress every day adds up to remarkable results.</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-violet-100"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${stats.progress}%` }}/></div>
          <p className="mt-2 text-[11px] font-semibold text-violet-700">{stats.progress}% overall completion</p>
        </div>
        <p className="mt-5 text-center text-[10px] text-slate-400">TASKFLOW · FRONTEND EDITION</p>
      </aside>

      <main className="min-h-screen w-full md:ml-[260px] md:w-[calc(100%-260px)]">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#f7f8fc]/90 px-4 py-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex w-full min-w-0 items-center gap-2 sm:gap-3">
            <button aria-label="Open navigation" onClick={() => setMobileNavOpen(true)} className="shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 md:hidden"><Menu size={18}/></button>
            <div className="flex shrink-0 items-center gap-2 md:hidden"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white"><CheckCheck size={17}/></span><span className="text-sm font-extrabold tracking-tight text-slate-900">TaskFlow</span></div>
            <div className="relative min-w-0 max-w-[460px] flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17}/>
              <input aria-label="Search tasks" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks, categories..." className="w-full rounded-xl border border-slate-200/80 bg-white py-2.5 pl-10 pr-14 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-50"/>
              <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 sm:flex"><Command size={10}/> K</span>
            </div>
            <div className="ml-auto hidden items-center gap-3 sm:flex">
              <div className="hidden text-right lg:block"><p className="text-sm font-semibold text-slate-800">Your workspace</p><p className="text-xs text-slate-400">One task at a time</p></div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white ring-4 ring-white">TF</div>
            </div>
          </div>
        </header>

        <div className="w-full min-w-0 px-3 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-violet-600"><span className="h-1.5 w-1.5 rounded-full bg-violet-500"/>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-[34px]">{activeView === 'Dashboard' ? 'Good to see you 👋' : activeView}</h1>
              <p className="mt-2 text-sm text-slate-500">{activeView === 'Dashboard' ? 'Make space for what matters. Here’s your productivity overview.' : `Keep your momentum going. Here are your ${activeView.toLowerCase()} tasks.`}</p>
            </div>
            <button onClick={openCreate} className="btn-primary self-start sm:self-auto"><Plus size={17}/> Add a task</button>
          </section>

          {activeView === 'Dashboard' && <Dashboard stats={stats} tasks={tasks} onViewAll={() => setActiveView('All Tasks')} onCreate={openCreate}/ >}

          <section className="mt-8">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div><h2 className="text-lg font-bold text-slate-900">{activeView === 'Dashboard' ? "Today's focus" : `${activeView} tasks`}</h2><p className="mt-1 text-xs text-slate-400">{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'} shown</p></div>
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                <div className="relative min-w-0">
                  <select aria-label="Filter by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="field min-w-0 appearance-none py-2.5 pr-8 text-xs font-medium sm:min-w-[130px]"><option>All</option><option>Active</option><option>Completed</option></select><ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                </div>
                <div className="relative min-w-0">
                  <select aria-label="Filter by priority" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="field min-w-0 appearance-none py-2.5 pr-8 text-xs font-medium sm:min-w-[145px]"><option>All priorities</option>{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                </div>
                <div className="relative min-w-0">
                  <select aria-label="Filter by category" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="field min-w-0 appearance-none py-2.5 pr-8 text-xs font-medium sm:min-w-[150px]"><option>All categories</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                </div>
              </div>
            </div>
            <div className="panel overflow-hidden">
              {visibleTasks.length ? <div className="divide-y divide-slate-100">{visibleTasks.map(task => <TaskRow key={task.id} task={task} onToggle={toggleTask} onEdit={editTask} onDelete={deleteTask}/>)}</div> : <EmptyState onCreate={openCreate} hasFilters={Boolean(search || statusFilter !== 'All' || priorityFilter !== 'All priorities' || categoryFilter !== 'All categories')}/>}
              {visibleTasks.length > 0 && <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between"><span>Showing {visibleTasks.length} of {tasks.length} tasks</span><button onClick={() => { setSearch(''); setStatusFilter('All'); setPriorityFilter('All priorities'); setCategoryFilter('All categories') }} className="self-start font-semibold text-violet-600 hover:text-violet-800">Clear filters</button></div>}
            </div>
          </section>

          <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 py-5 text-[11px] text-slate-400 sm:flex-row"><span>Made for focus, built for progress.</span><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/> Your tasks are saved locally on this device</span></footer>
        </div>
      </main>

      {modalOpen && <TaskModal task={editingTask} onClose={() => { setModalOpen(false); setEditingTask(null) }} onSave={saveTask}/>}
      {toast && <div role="status" className="fixed bottom-4 left-3 right-3 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl sm:bottom-5 sm:left-auto sm:right-5 sm:w-auto"><CheckCircle2 size={17} className="text-emerald-400"/>{toast}</div>}
    </div>
  )
}

function NavButton({ label, Icon, count, active, onClick }) {
  return <button onClick={onClick} className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition', active ? 'bg-violet-50 font-semibold text-violet-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800')}><Icon size={17} strokeWidth={active ? 2.3 : 1.8}/><span className="flex-1">{label}</span>{count !== null && <span className={cx('min-w-6 rounded-md px-1.5 py-0.5 text-center text-[10px] font-semibold', active ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-400')}>{count}</span>}</button>
}

function Dashboard({ stats, tasks, onViewAll, onCreate }) {
  const cards = [
    { label: 'Total tasks', value: stats.total, hint: 'Across your workspace', Icon: ClipboardList, tone: 'violet' },
    { label: 'Completed', value: stats.completed, hint: `${stats.progress}% completion rate`, Icon: CheckCircle2, tone: 'emerald' },
    { label: 'In progress', value: stats.active, hint: 'Tasks still on your list', Icon: Clock3, tone: 'amber' },
    { label: 'Overdue', value: stats.overdue, hint: 'Past their due date', Icon: AlertCircle, tone: 'rose' },
  ]
  const toneClasses = { violet: 'bg-violet-50 text-violet-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', rose: 'bg-rose-50 text-rose-600' }
  const upcoming = tasks.filter(t => !t.completed).sort((a,b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999')).slice(0, 4)
  return <>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map(({ label, value, hint, Icon, tone }) => <div key={label} className="panel p-4 sm:p-5"><div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-slate-500 sm:text-sm">{label}</span><span className={cx('flex h-9 w-9 items-center justify-center rounded-xl', toneClasses[tone])}><Icon size={18}/></span></div><div className="mt-4 flex items-end justify-between"><span className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</span>{label === 'Completed' && <TrendingUp size={16} className="mb-1 text-emerald-500"/>}</div><p className="mt-1 text-[10px] text-slate-400 sm:text-xs">{hint}</p></div>)}
    </div>
    <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      <div className="panel p-5 sm:p-6">
        <div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><Target size={17} className="text-violet-600"/><h3 className="font-bold text-slate-900">Your progress</h3></div><p className="mt-1 text-xs text-slate-400">Every completed task moves you forward.</p></div><span className="rounded-lg bg-violet-50 px-2.5 py-1 text-sm font-bold text-violet-700">{stats.progress}%</span></div>
        <div className="mt-6 flex items-end justify-between"><p className="text-sm text-slate-600"><span className="font-bold text-slate-900">{stats.completed}</span> of {stats.total} tasks completed</p><p className="text-xs text-slate-400">{stats.total - stats.completed} remaining</p></div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{ width: `${stats.progress}%` }}/></div>
        <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700">{stats.completed} done</span><span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700">{stats.active} active</span><span className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700">{stats.overdue} overdue</span></div>
      </div>
      <div className="panel p-5 sm:p-6">
        <div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><CalendarClock size={17} className="text-violet-600"/><h3 className="font-bold text-slate-900">Up next</h3></div><p className="mt-1 text-xs text-slate-400">A quick look at what’s on your plate.</p></div><button onClick={onViewAll} className="text-xs font-semibold text-violet-600 hover:text-violet-800">View all</button></div>
        <div className="mt-4 space-y-3">
          {upcoming.length ? upcoming.map(task => <div key={task.id} className="flex items-center gap-3"><span className={cx('h-2 w-2 shrink-0 rounded-full', task.priority === 'High' ? 'bg-rose-400' : task.priority === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400')}/><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-700">{task.title}</p><p className="mt-0.5 text-[10px] text-slate-400">{task.category}</p></div><span className={cx('shrink-0 text-[10px] font-medium', isOverdue(task) ? 'text-rose-600' : 'text-slate-400')}>{isOverdue(task) ? 'Overdue' : formatDate(task.dueDate)}</span></div>) : <div className="rounded-xl bg-slate-50 p-4 text-center"><p className="text-xs text-slate-500">You’re all caught up.</p></div>}
        </div>
      </div>
    </div>
  </>
}

function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const overdue = isOverdue(task)
  const priorityClass = task.priority === 'High' ? 'bg-rose-50 text-rose-700' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
  return <div className={cx('group flex items-start gap-3 px-4 py-4 transition hover:bg-slate-50/70 sm:items-center sm:px-5', task.completed && 'bg-slate-50/40')}>
    <button aria-label={task.completed ? `Mark ${task.title} active` : `Complete ${task.title}`} onClick={() => onToggle(task.id)} className={cx('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition sm:mt-0', task.completed ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 text-transparent hover:border-violet-500 hover:text-violet-400')}><Check size={12} strokeWidth={3}/></button>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2"><p className={cx('text-sm font-semibold', task.completed ? 'text-slate-400 line-through' : 'text-slate-800')}>{task.title}</p>{overdue && <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-600">Overdue</span>}</div>
      {task.description && <p className="mt-1 line-clamp-1 text-xs text-slate-400">{task.description}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2 sm:hidden"><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-500">{task.category}</span><span className={cx('rounded-md px-2 py-1 text-[10px] font-semibold', priorityClass)}>{task.priority}</span><span className={cx('flex items-center gap-1 text-[10px]', overdue ? 'text-rose-600' : 'text-slate-400')}><CalendarDays size={11}/>{formatDate(task.dueDate)}</span></div>
    </div>
    <div className="hidden min-w-[100px] sm:block"><span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-600"><Folder size={12} className="text-slate-400"/>{task.category}</span></div>
    <div className="hidden min-w-[82px] sm:block"><span className={cx('inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold', priorityClass)}><Flag size={11}/>{task.priority}</span></div>
    <div className={cx('hidden min-w-[88px] items-center gap-1.5 text-xs sm:flex', overdue ? 'font-semibold text-rose-600' : 'text-slate-400')}><CalendarDays size={13}/>{formatDate(task.dueDate)}</div>
    <div className="relative ml-1"><button aria-label={`Actions for ${task.title}`} onClick={() => setMenuOpen(v => !v)} className="rounded-lg p-2 text-slate-400 opacity-100 transition hover:bg-slate-100 hover:text-slate-700 sm:opacity-0 sm:group-hover:opacity-100"><MoreHorizontal size={18}/></button>{menuOpen && <><button aria-label="Close task menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuOpen(false)}/><div className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"><button onClick={() => { onEdit(task); setMenuOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"><Pencil size={13}/> Edit task</button><button onClick={() => { onDelete(task.id); setMenuOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-rose-600 hover:bg-rose-50"><Trash2 size={13}/> Delete task</button></div></>}</div>
  </div>
}

function EmptyState({ onCreate, hasFilters }) {
  return <div className="flex flex-col items-center px-5 py-14 text-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500"><Inbox size={25}/></div><h3 className="mt-4 font-bold text-slate-800">{hasFilters ? 'No matching tasks' : 'Nothing on your list yet'}</h3><p className="mt-1 max-w-xs text-sm leading-6 text-slate-400">{hasFilters ? 'Try changing your search or filters to find what you need.' : 'Create your first task and start turning plans into progress.'}</p>{!hasFilters && <button onClick={onCreate} className="btn-primary mt-5"><Plus size={16}/> Create your first task</button>}</div>
}

function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [category, setCategory] = useState(task?.category || 'Work')
  const [priority, setPriority] = useState(task?.priority || 'Medium')
  const [dueDate, setDueDate] = useState(task?.dueDate || '')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) { setError('Please enter a task title.'); return }
    onSave({ title: title.trim(), description: description.trim(), category, priority, dueDate, completed: task?.completed || false })
  }

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-[3px] sm:items-center sm:p-4" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
    <div role="dialog" aria-modal="true" aria-labelledby="task-modal-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-7">
      <div className="mb-6 flex items-start justify-between"><div><div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><ListTodo size={18}/></div><h2 id="task-modal-title" className="text-xl font-extrabold text-slate-900">{task ? 'Edit task' : 'Create a task'}</h2><p className="mt-1 text-sm text-slate-400">{task ? 'Make changes to your task details.' : 'Capture it now, take it one step at a time.'}</p></div><button onClick={onClose} aria-label="Close dialog" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={19}/></button></div>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="field-label" htmlFor="task-title">Task title <span className="text-rose-500">*</span></label><input id="task-title" autoFocus maxLength={120} value={title} onChange={e => { setTitle(e.target.value); setError('') }} className="field" placeholder="e.g. Prepare project presentation"/>{error && <p role="alert" className="mt-1.5 text-xs text-rose-600">{error}</p>}</div>
        <div><label className="field-label" htmlFor="task-description">Description <span className="font-normal normal-case tracking-normal text-slate-400">(optional)</span></label><textarea id="task-description" rows={3} maxLength={500} value={description} onChange={e => setDescription(e.target.value)} className="field resize-none" placeholder="Add a few details to help you get started..."/></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className="field-label" htmlFor="task-category">Category</label><select id="task-category" value={category} onChange={e => setCategory(e.target.value)} className="field">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="field-label" htmlFor="task-priority">Priority</label><select id="task-priority" value={priority} onChange={e => setPriority(e.target.value)} className="field">{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select></div>
        </div>
        <div><label className="field-label" htmlFor="task-due-date">Due date <span className="font-normal normal-case tracking-normal text-slate-400">(optional)</span></label><input id="task-due-date" type="date" min={undefined} value={dueDate} onChange={e => setDueDate(e.target.value)} className="field"/></div>
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary"><Check size={16}/>{task ? 'Save changes' : 'Create task'}</button></div>
      </form>
    </div>
  </div>
}

export default App
