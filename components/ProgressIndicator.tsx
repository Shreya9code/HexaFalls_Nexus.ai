'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Loader2 } from 'lucide-react'

interface ProgressIndicatorProps {
  currentStep: number
  progress: number
}

const steps = [
  'Extracting audio from video...',
  'Transcribing speech...',
  'Analyzing speech content...',
  'Processing facial expressions...',
  'Generating feedback...'
]

export default function ProgressIndicator({ currentStep, progress }: ProgressIndicatorProps) {
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              index === currentStep 
                ? 'bg-primary-50 border border-primary-200' 
                : index < currentStep 
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex-shrink-0">
              {index < currentStep ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : index === currentStep ? (
                <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <span className={`text-sm font-medium ${
              index === currentStep 
                ? 'text-primary-900' 
                : index < currentStep 
                  ? 'text-green-900'
                  : 'text-gray-500'
            }`}>
              {step}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Current Step Info */}
      {currentStep < steps.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-sm font-medium text-blue-900">
              Currently: {steps[currentStep]}
            </span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            This may take a few moments depending on your video length...
          </p>
        </motion.div>
      )}
    </div>
  )
} 