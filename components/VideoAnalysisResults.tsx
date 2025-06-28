'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  Smile, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  MessageSquare,
  Lightbulb,
  Star,
  Play,
  Loader2
} from 'lucide-react'
import AnalysisResults from './AnalysisResults'
import ProgressIndicator from './ProgressIndicator'

interface AnalysisResult {
  speechAnalysis: {
    text: string
    evaluation: string
    confidence: number
    feedback: string
    suggestions: string[]
  }
  facialAnalysis: {
    dominantExpression: string
    feedback: string
  }
  isComplete: boolean
}

interface VideoAnalysisResultsProps {
  questionText?: string
  onAnalysisComplete?: (result: AnalysisResult) => void
}

export default function VideoAnalysisResults({ questionText, onAnalysisComplete }: VideoAnalysisResultsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const performAnalysis = async () => {
    setIsAnalyzing(true)
    setCurrentStep(0)
    setProgress(0)
    setError(null)

    try {
      // Update progress steps
      const steps = [
        { name: 'Loading video file...', duration: 1000 },
        { name: 'Extracting audio from video...', duration: 2000 },
        { name: 'Transcribing speech...', duration: 3000 },
        { name: 'Analyzing speech content...', duration: 2500 },
        { name: 'Processing facial expressions...', duration: 4000 },
        { name: 'Generating feedback...', duration: 1500 }
      ]

      // Simulate progress while API call is processing
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        setProgress((i / steps.length) * 100)
        
        if (i === 0) {
          // Make the actual API call at the beginning
          const response = await fetch('/api/analyze-video', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              videoPath: 'uploads/temp.mp4',
              questionText: questionText || ''
            })
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result = await response.json()
          
          if (result.error) {
            throw new Error(result.error)
          }

          setAnalysisResult(result)
          if (onAnalysisComplete) {
            onAnalysisComplete(result)
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, steps[i].duration))
      }

      setProgress(100)
    } catch (error) {
      console.error('Analysis error:', error)
      setError(error instanceof Error ? error.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setAnalysisResult(null)
    setCurrentStep(0)
    setProgress(0)
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      {!analysisResult && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Video Analysis</h3>
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Ready to analyze</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-4">
            Analyze your video response to get detailed feedback on your speech and facial expressions.
          </p>
          
          <button
            onClick={performAnalysis}
            disabled={isAnalyzing}
            className="btn-primary flex items-center"
          >
            {isAnalyzing ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Play className="w-5 h-5 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Video Response'}
          </button>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">Analysis Error:</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={resetAnalysis}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Progress Indicator */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-600" />
            Analyzing Your Response
          </h3>
          <ProgressIndicator currentStep={currentStep} progress={progress} />
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysisResult && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Analysis Complete</h3>
            <button
              onClick={resetAnalysis}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Analyze Again
            </button>
          </div>
          
          <AnalysisResults result={analysisResult} />
        </motion.div>
      )}
    </div>
  )
} 