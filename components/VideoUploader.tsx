'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Video, FileVideo } from 'lucide-react'

interface VideoUploaderProps {
  onVideoReady: () => void
}

export default function VideoUploader({ onVideoReady }: VideoUploaderProps) {
  React.useEffect(() => {
    // Automatically trigger video ready when component mounts
    onVideoReady()
  }, [onVideoReady])

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-green-200 bg-green-50 rounded-lg p-6"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <FileVideo className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-1">
              Using temp.mp4.mp4
            </h3>
            <p className="text-green-700">
              Video file loaded from uploads folder
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Video className="w-4 h-4" />
            <span>File: uploads/temp.mp4.mp4</span>
          </div>
        </div>
      </motion.div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Ready to analyze the video file
        </p>
      </div>
    </div>
  )
} 