import React from "react";

// Remove the type annotation for .jsx files
// If you want type safety, rename this file to .tsx and use the type annotation

type LevelSelectorDuolingoProps = {
  totalLevels: number;
  currentLevel: number;
  onSelectLevel: (level: number) => void;
  unlockedLevels: number[];
  completedLevels?: number[];
};

export default function LevelSelectorDuolingo({
  totalLevels,
  currentLevel,
  onSelectLevel,
  unlockedLevels,
  completedLevels = [],
}: LevelSelectorDuolingoProps) {
  return (
    <div className="w-full overflow-x-auto py-8" style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif' }}>
      <div className="flex items-center min-w-max gap-0 relative">
        {Array.from({ length: totalLevels }).map((_, idx) => {
          const isUnlocked = unlockedLevels.includes(idx);
          const isActive = currentLevel === idx;
          const isCompleted = completedLevels.includes(idx);
          return (
            <div key={idx} className="flex items-center relative">
              {/* Progress line (except for first circle) */}
              {idx !== 0 && (
                <div className={`h-3 w-12 sm:w-20 bg-gradient-to-r ${isCompleted ? 'from-green-400 to-green-500' : isUnlocked ? 'from-blue-300 to-blue-400' : 'from-gray-300 to-gray-400'} rounded-full z-0 shadow-md`} />
              )}
              <button
                onClick={() => isUnlocked && onSelectLevel(idx)}
                className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full border-4 shadow-2xl transition-all duration-300
                  ${isActive ? 'border-yellow-400 scale-110 animate-bounce ring-4 ring-yellow-200' : isCompleted ? 'border-green-400' : isUnlocked ? 'border-blue-400' : 'border-gray-300'}
                  ${isActive ? 'bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-500 shadow-yellow-300/60' : isCompleted ? 'bg-gradient-to-br from-green-200 via-green-400 to-green-500 shadow-green-300/60' : isUnlocked ? 'bg-gradient-to-br from-blue-200 via-blue-400 to-blue-500 shadow-blue-300/60' : 'bg-gray-200'}
                  ${!isUnlocked ? 'cursor-not-allowed opacity-60' : 'hover:scale-105'}
                  font-extrabold text-2xl sm:text-3xl drop-shadow-lg select-none`
                }
                disabled={!isUnlocked}
                style={{ boxShadow: isActive ? '0 8px 32px 0 rgba(255, 221, 51, 0.4)' : '0 4px 16px 0 rgba(0,0,0,0.15)' }}
              >
                {isCompleted ? (
                  <span className="text-4xl animate-pulse">✔️</span>
                ) : !isUnlocked ? (
                  <span className="text-3xl">🔒</span>
                ) : (
                  <span className="font-extrabold text-2xl sm:text-3xl">{idx + 1}</span>
                )}
                {/* Bubble shine effect */}
                <span className="absolute top-2 left-3 w-8 h-4 bg-white bg-opacity-30 rounded-full blur-sm pointer-events-none" style={{ filter: 'blur(2px)' }}></span>
                {/* Bubble bottom shadow */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-black bg-opacity-10 rounded-full blur-sm pointer-events-none" />
                {/* Glow for active */}
                {isActive && <span className="absolute inset-0 rounded-full ring-4 ring-yellow-200 animate-pulse pointer-events-none" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
} 