"use client"
import React from 'react'
import { useUser } from '@clerk/nextjs'
import AiTools from './_components/AiTools'
import History from './_components/History'
import WelcomeBanner from './_components/WelcomeBanner'

const Dashboard = () => {
  const { user } = useUser()

  return (
    <div className="space-y-8 mystical-bg min-h-screen">
      {/* Floating mystical particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <WelcomeBanner userName={user?.firstName} />
      
      <div className="space-y-8">
        <div className="floating">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
            🧙‍♂️ Mystical AI Tools 🧙‍♂️
          </h2>
          <AiTools />
        </div>
        
        <div className="floating" style={{ animationDelay: '1s' }}>
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
            📜 Recent Adventures 📜
          </h2>
          <History />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
