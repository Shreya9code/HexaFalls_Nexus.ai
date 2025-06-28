import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight } from 'lucide-react'
import React from 'react'

const WelcomeBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-8 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-2xl font-bold">AI Career Mentor</h2>
          </div>
          <p className="text-blue-100 dark:text-blue-200 max-w-md">
            Get personalized career guidance, interview preparation, and professional development insights powered by AI.
          </p>
          <Button 
            className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-white dark:text-blue-600 dark:hover:bg-blue-50 font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="hidden lg:block">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
            <Sparkles className="h-16 w-16 text-white/80" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeBanner
