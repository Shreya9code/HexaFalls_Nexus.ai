"use client"
import React from 'react'
import { useUser } from '@clerk/nextjs'
import AiTools from './_components/AiTools'
import History from './_components/History'
import WelcomeBanner from './_components/WelcomeBanner'

const Dashboard = () => {
  const { user } = useUser()

  return (
    <div className="space-y-8">
      <WelcomeBanner userName={user?.firstName} />
      
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">AI Career Tools</h2>
          <AiTools />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Recent Activity</h2>
          <History />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
