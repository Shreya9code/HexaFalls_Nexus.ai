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
    StarsIcon
} from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "AI Career Chat",
        url: "/ai-tools/ai-chat",
        icon: MessageCircle,
    },
    {
        title: "Resume Analyzer",
        url: "/ai-tools/ai-resume-analyzer",
        icon: FileText,
    },
    {
        title: "Career Roadmap",
        url: "/ai-tools/ai-roadmap-agent",
        icon: Target,
    },
    {
        title: "Mock Interviews",
        url: "/ai-tools/AiMockInterview",
        icon: Users,
    },
    {
        title: "Contest Tracker",
        url: "/ai-tools/contest-tracker",
        icon: BarChart3,
    },
    {
        title: "Quiz",
        url: "/ai-tools/quiz",
        icon: Layers,
    },
    {
        title: "Industry Insights",
        url: "/ai-tools/industry-insights",
        icon: Inbox,
    },
    {
        title: "Upgrade",
        url: "/upgrade",
        icon: StarsIcon,
    },
    {
        title: "Profile",
        url: "/profile",
        icon: UserCircle,
    },
]

export function AppSidebar() {
    const path = usePathname();
    
    return (
        <Sidebar className="border-r border-border bg-sidebar">
            <SidebarHeader className="border-b border-border">
                <div className='p-6'>
                    <div className="flex items-center gap-3 mb-2">
                        <Image src={'/logo.png?v=2'} alt='logo' width={32} height={32} />
                        <h1 className="text-xl font-bold text-sidebar-foreground">Nexus.ai</h1>
                    </div>
                    <p className='text-sm text-muted-foreground'>AI Career Mentor</p>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className='space-y-1'>
                            {items.map((item, index) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link 
                                            href={item.url} 
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                                                path === item.url || path.startsWith(item.url + '/')
                                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-r-2 border-sidebar-primary' 
                                                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                            }`}
                                        >
                                            <item.icon className='h-5 w-5' />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-border p-4">
                <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Settings</span>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}