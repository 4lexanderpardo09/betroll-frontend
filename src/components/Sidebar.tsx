import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Wallet, Dice6, TrendingUp, LogOut, GitMerge } from 'lucide-react'
import { useUIStore } from '../store/uiStore'
import { useAuthStore } from '../store/authStore'

export function Sidebar() {
  const { sidebarOpen, closeSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/bets', icon: Dice6, label: 'Apuestas' },
    { path: '/bankroll', icon: Wallet, label: 'Bankroll' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/parlays', icon: GitMerge, label: 'Parlays' },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-bg-secondary border-r border-border-dark
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border-dark">
            <h1 className="text-xl font-bold text-gold">BetRoll</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path)
                    ? 'bg-gold/10 text-gold'
                    : 'text-gray-400 hover:text-white hover:bg-bg-card'
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t border-border-dark">
            {user && (
              <p className="text-sm text-gray-400 mb-3 truncate">{user.name}</p>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white w-full transition-colors"
            >
              <LogOut size={20} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
