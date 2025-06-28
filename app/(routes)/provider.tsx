"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import axios from "axios";
import AppHeader from '../_components/AppHeader';
import { AppSidebar } from '../_components/AppSidebar';

function DashboardProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppHeader />
                <div className='p-6 lg:p-8 max-w-7xl mx-auto'>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardProvider