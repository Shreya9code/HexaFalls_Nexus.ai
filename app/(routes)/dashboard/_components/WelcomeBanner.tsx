import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, Wand2, Star } from 'lucide-react'
import React from 'react'

const WelcomeBanner = ({ userName }: { userName?: string | null }) => {
  return (
    <div className="relative overflow-hidden glass-panel rounded-2xl p-8 mystical-border">
      {/* Mystical background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-violet-500/10 to-emerald-500/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Wand2 className="h-8 w-8 text-emerald-400 animate-pulse" />
              <Star className="absolute -top-1 -right-1 h-3 w-3 text-violet-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
              Welcome, {userName || 'Adventurer'}! 🧙‍♂️
            </h2>
          </div>
          <p className="text-emerald-100 max-w-md text-lg">
            Embark on a mystical journey through the enchanted forest of career possibilities. 
            Let the ancient AI spirits guide your path to greatness.
          </p>
          <Button 
            variant="mystical"
            size="lg"
            className="group relative overflow-hidden"
          >
            <span className="relative z-10">Begin Your Quest</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Button>
        </div>
        <div className="hidden lg:block relative">
          <div className="w-32 h-32 glass-panel rounded-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-violet-500/20 animate-spin" style={{ animationDuration: '10s' }}></div>
            <Sparkles className="h-16 w-16 text-emerald-400 relative z-10 animate-pulse" />
            {/* Floating runes around the circle */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-emerald-400 text-xs animate-bounce">⚡</div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-violet-400 text-xs animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-cyan-400 text-xs animate-bounce" style={{ animationDelay: '1s' }}>🌟</div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-400 text-xs animate-bounce" style={{ animationDelay: '1.5s' }}>💫</div>
          </div>
        </div>
      </div>
      
      {/* Mystical corner decorations */}
      <div className="absolute top-4 right-4 text-emerald-400 text-2xl animate-pulse">🔮</div>
      <div className="absolute bottom-4 left-4 text-violet-400 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>📜</div>
    </div>
  )
}

export default WelcomeBanner
