import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import { Bell, Search, Sun, Moon, RefreshCw } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../provider'
import Link from 'next/link'

function AppHeader() {
    const { theme, toggleTheme } = useTheme()
    const [xp, setXp] = useState<number | null>(null)

    useEffect(() => {
        async function fetchXP() {
            try {
                const res = await fetch('/api/quiz-xp')
                if (res.ok) {
                    const data = await res.json()
                    setXp(data.xp)
                }
            } catch (err) {
                setXp(null)
            }
        }
        fetchXP()
        // Listen for XP updates
        const handler = () => fetchXP()
        window.addEventListener('xp-updated', handler)
        return () => window.removeEventListener('xp-updated', handler)
    }, [])

    return (
        <header className='bg-card border-b border-border px-6 py-4 shadow-sm'>
            <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-4'>
                    <SidebarTrigger className="p-2 hover:bg-accent rounded-lg transition-colors" />
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent w-64 bg-background text-foreground"
                        />
                    </div>
                </div>
                
                <div className='flex items-center gap-4'>
                    <button 
                        onClick={toggleTheme}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        {theme === 'light' ? (
                            <Moon className="h-5 w-5 text-foreground" />
                        ) : (
                            <Sun className="h-5 w-5 text-foreground" />
                        )}
                    </button>
                    {xp !== null && (
                        <button
                            onClick={async () => {
                                try {
                                    const res = await fetch('/api/quiz-xp');
                                    if (res.ok) {
                                        const data = await res.json();
                                        setXp(data.xp);
                                    }
                                } catch {}
                            }}
                            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold select-none transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            title="Refresh XP"
                        >
                            XP: {xp}
                        </button>
                    )}
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors relative">
                        <Bell className="h-5 w-5 text-foreground" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                    </button>
                    <Link href="/upgrade">
                        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">Upgrade</span>
                    </Link>
                    <UserButton 
                        appearance={{
                            elements: {
                                avatarBox: "h-8 w-8"
                            }
                        }}
                    />
                </div>
            </div>
        </header>
    )
}

export default AppHeader