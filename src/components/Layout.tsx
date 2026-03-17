import { ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useUIStore } from '../store/uiStore'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { toggleSidebar } = useUIStore()

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Mobile header with hamburger */}
      <header className="md:hidden bg-bg-secondary border-b border-border-dark p-4 fixed top-0 left-0 right-0 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-white"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  )
}
