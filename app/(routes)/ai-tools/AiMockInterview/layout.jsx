// Setting the AiMockInterview layout
import React from 'react'

function AiMockInterviewLayout({children}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AiMockInterviewLayout