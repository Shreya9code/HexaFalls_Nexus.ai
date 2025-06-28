'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  Smile, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  MessageSquare,
  Lightbulb,
  Star
} from 'lucide-react'

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

interface AnalysisResultsProps {
  result: AnalysisResult
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Excellent'
    if (confidence >= 0.6) return 'Good'
    return 'Needs Improvement'
  }

  const getEvaluationIcon = (evaluation: string) => {
    return evaluation === 'POSITIVE' ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-600" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Overall Performance</h3>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-bold text-gray-900">
              {Math.round(result.speechAnalysis.confidence * 100)}%
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getEvaluationIcon(result.speechAnalysis.evaluation)}
          <span className="font-medium text-gray-700">
            {getConfidenceLabel(result.speechAnalysis.confidence)}
          </span>
        </div>
      </motion.div>

      {/* Speech Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Mic className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Speech Analysis</h3>
        </div>
        
        <div className="space-y-4">
          {/* Transcribed Text */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Transcribed Response:</h4>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800">
              "{result.speechAnalysis.text}"
            </div>
          </div>

          {/* Evaluation */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Evaluation:</h4>
              <div className="flex items-center space-x-2">
                {getEvaluationIcon(result.speechAnalysis.evaluation)}
                <span className="text-sm font-medium">
                  {result.speechAnalysis.evaluation}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Confidence Score:</h4>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                <span className={`text-sm font-medium ${getConfidenceColor(result.speechAnalysis.confidence)}`}>
                  {Math.round(result.speechAnalysis.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Feedback:</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">{result.speechAnalysis.feedback}</p>
            </div>
          </div>

          {/* Suggestions */}
          {result.speechAnalysis.suggestions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                Suggestions for Improvement:
              </h4>
              <ul className="space-y-2">
                {result.speechAnalysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      {/* Facial Expression Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Smile className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Facial Expression Analysis</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Dominant Expression:</h4>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium capitalize">
                {result.facialAnalysis.dominantExpression}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Expression Feedback:</h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-900">{result.facialAnalysis.feedback}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
      >
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Next Steps</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Based on your analysis, here are some recommended actions:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Practice your responses to common interview questions</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Record yourself to improve facial expressions and body language</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Focus on speaking clearly and avoiding filler words</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
} 