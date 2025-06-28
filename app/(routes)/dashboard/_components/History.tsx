"use client";
import Image from "next/image";
import React, { useState } from "react";
import { ScrollText, Sparkles, Clock } from 'lucide-react';

const History = () => {
  const [userHistory, setUserHistory] = useState([]);

  return (
    <div className="glass-panel mystical-border rounded-xl p-8 relative overflow-hidden">
      {/* Mystical background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-violet-500/5 rounded-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-violet-500/20">
            <ScrollText className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
              📜 Scroll of Past Adventures
            </h2>
            <p className="text-emerald-100 text-sm">Your mystical journey through time</p>
          </div>
        </div>

        {userHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center relative">
            {/* Floating mystical elements */}
            <div className="absolute top-4 left-1/4 text-emerald-400 text-2xl animate-pulse">🔮</div>
            <div className="absolute top-8 right-1/4 text-violet-400 text-xl animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
            <div className="absolute bottom-8 left-1/3 text-cyan-400 text-lg animate-pulse" style={{ animationDelay: '2s' }}>💫</div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 glass-panel rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-violet-500/20 animate-spin" style={{ animationDuration: '10s' }}></div>
                <Clock className="h-12 w-12 text-emerald-400 relative z-10" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-100 mb-2">
                No Adventures Yet
              </h3>
              <p className="text-emerald-200 max-w-md">
                Your scroll of past adventures is empty. Begin your mystical journey 
                by using one of the enchanted tools above!
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-sm">The ancient spirits await your call</span>
                <Sparkles className="h-4 w-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
