import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
    Calendar, 
    Home, 
    Inbox, 
    Layers, 
    Search, 
    Settings, 
    UserCircle, 
    Wallet,
    MessageCircle,
    FileText,
    Target,
    Users,
    BarChart3,
    StarsIcon,
    Sparkles,
    Wand2,
    Star
} from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        emoji: "🏠"
    },
    {
        title: "AI Career Chat",
        url: "/ai-tools/ai-chat",
        icon: MessageCircle,
        emoji: "🔮"
    },
    {
        title: "Resume Analyzer",
        url: "/ai-tools/ai-resume-analyzer",
        icon: FileText,
        emoji: "📜"
    },
    {
        title: "Career Roadmap",
        url: "/ai-tools/ai-roadmap-agent",
        icon: Target,
        emoji: "🗺️"
    },
    {
        title: "Mock Interviews",
        url: "/ai-tools/AiMockInterview",
        icon: Users,
        emoji: "⚔️"
    },
    {
        title: "Contest Tracker",
        url: "/ai-tools/contest-tracker",
        icon: BarChart3,
        emoji: "🏆"
    },
    {
        title: "Quiz",
        url: "/ai-tools/quiz",
        icon: Layers,
        emoji: "🧠"
    },
    {
        title: "Upgrade",
        url: "/upgrade",
        icon: StarsIcon,
        emoji: "⭐"
    },
    {
        title: "Profile",
        url: "/profile",
        icon: UserCircle,
        emoji: "👤"
    },
]

export function AppSidebar() {
    const path = usePathname();
    
    return (
        <Sidebar className="border-r border-emerald-500/20 glass-panel bg-sidebar/80 backdrop-blur-md">
            <SidebarHeader className="border-b border-emerald-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-violet-500/5"></div>
                <div className='p-6 relative z-10'>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative">
                            <Image src={'/logo.png?v=2'} alt='logo' width={32} height={32} />
                            <Star className="absolute -top-1 -right-1 h-3 w-3 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                            🧙‍♂️ Nexus.ai
                        </h1>
                    </div>
                    <p className='text-sm text-emerald-100'>Mystical AI Career Mentor</p>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className='space-y-2'>
                            {items.map((item, index) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link 
                                            href={item.url} 
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                                                path === item.url || path.startsWith(item.url + '/')
                                                    ? 'bg-gradient-to-r from-emerald-500/20 to-violet-500/20 text-emerald-400 border-r-2 border-emerald-500 shadow-lg' 
                                                    : 'text-emerald-100 hover:bg-emerald-500/10 hover:text-emerald-300 hover:scale-105'
                                            }`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative z-10 flex items-center gap-3">
                                                <span className="text-lg">{item.emoji}</span>
                                                <item.icon className='h-5 w-5' />
                                                <span className="font-medium">{item.title}</span>
                                            </div>
                                            {path === item.url || path.startsWith(item.url + '/') && (
                                                <Sparkles className="absolute right-2 h-4 w-4 text-emerald-400 animate-pulse" />
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-emerald-500/20 p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent"></div>
                <div className="relative z-10 flex items-center gap-3 px-3 py-2 text-emerald-100 hover:text-emerald-300 transition-colors cursor-pointer">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Mystical Settings</span>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}