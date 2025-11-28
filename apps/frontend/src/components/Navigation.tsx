'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Upload, Layers, ImageIcon, Sparkles } from 'lucide-react'

const navItems = [
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/queue', label: 'Queue', icon: Layers },
  { href: '/review', label: 'Review', icon: ImageIcon },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-semibold text-slate-100 hover:text-coral-400 transition-colors">
          <Sparkles className="text-coral-500" size={22} />
          <span>RapidPhotoFlow</span>
        </Link>

        <div className="flex gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-coral-400 bg-coral-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

