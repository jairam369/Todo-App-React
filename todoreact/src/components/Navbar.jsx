import React from 'react'
import { Search, Bell, ChevronDown, Menu, CheckSquare } from 'lucide-react'

const Navbar = () => {
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <img src='https://cracku.in/static/src/img/cracku_logo.png' alt='' width="201" height={44} className='max-w-full' />
        </a>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 rounded-full bg-gray-100 p-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={`block rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  link.name === 'Dashboard'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-white hover:text-indigo-600'
                }`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Right section */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <button type="button" aria-label="Search" className="hidden rounded-full border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-100 sm:flex">
            <Search size={19} />
          </button>

          {/* Notifications */}
          <button type="button" aria-label="Notifications" className="relative rounded-full p-2.5 text-gray-600 transition hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Profile */}
          <button type="button" className="flex items-center gap-2 rounded-full border border-gray-200 py-1.5 pl-1.5 pr-3 transition hover:bg-gray-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              U
            </div>
            <span className="hidden text-sm font-semibold text-gray-700 sm:block">
              Profile
            </span>
            <ChevronDown size={16} className="hidden text-gray-500 sm:block" />
          </button>

          {/* Mobile menu icon */}
          <button type="button" aria-label="Open menu" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden">
            <Menu size={22} />
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar