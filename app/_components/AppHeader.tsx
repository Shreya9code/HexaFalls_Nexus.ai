import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import { Bell, Search, Sun, Moon, RefreshCw, Sparkles, Wand2 } from 'lucide-react'
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
        <header className='glass-panel border-b border-emerald-500/20 px-6 py-4 shadow-lg relative overflow-hidden'>
            {/* Mystical background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-violet-500/5"></div>
            
            <div className='relative z-10 flex items-center justify-between w-full'>
                <div className='flex items-center gap-4'>
                    <SidebarTrigger className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors border border-emerald-500/20" />
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search the mystical realm..."
                            className="pl-10 pr-4 py-2 border border-emerald-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 w-64 bg-background/50 text-foreground backdrop-blur-sm"
                        />
                    </div>
                </div>
                
                <div className='flex items-center gap-4'>
                    <button 
                        onClick={toggleTheme}
                        className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors border border-emerald-500/20"
                    >
                        {theme === 'light' ? (
                            <Moon className="h-5 w-5 text-emerald-400" />
                        ) : (
                            <Sun className="h-5 w-5 text-emerald-400" />
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
                            className="ml-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black rounded-full text-sm font-bold select-none transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-lg hover:shadow-emerald-500/25"
                            title="Refresh Mystical Power"
                        >
                            <Sparkles className="inline h-3 w-3 mr-1" />
                            XP: {xp}
                        </button>
                    )}
                    <button className="p-2 hover:bg-violet-500/10 rounded-lg transition-colors relative border border-violet-500/20">
                        <Bell className="h-5 w-5 text-violet-400" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                    </button>
                    <Link href="/upgrade">
                        <span className="px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg font-bold hover:from-violet-700 hover:to-violet-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-violet-500/25 flex items-center gap-2">
                            <Wand2 className="h-4 w-4" />
                            Upgrade
                        </span>
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