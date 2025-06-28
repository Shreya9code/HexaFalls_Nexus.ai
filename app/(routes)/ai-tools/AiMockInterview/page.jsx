// Setting the main AiMockInterview
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

function AiMockInterview() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">AI Mock Interview</h1>
        <p className="text-muted-foreground">
          Create and start your AI-powered mock interview to practice and improve your skills
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AddNewInterview/>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Previous Interviews</h2>
        <InterviewList/>
      </div>
    </div>
  )
}

export default AiMockInterview