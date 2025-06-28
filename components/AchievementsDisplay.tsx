import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Zap, Flame } from 'lucide-react';
import { toast } from 'sonner';

export enum AchievementType {
  FIRST_PERFECT_SCORE = 0,
  STREAK_5 = 1,
  STREAK_10 = 2,
  STREAK_25 = 3,
  LEVEL_10 = 4,
  LEVEL_25 = 5,
  LEVEL_50 = 6,
  LEVEL_100 = 7,
  XP_100 = 8,
  XP_500 = 9,
  XP_1000 = 10,
  MASTER_QUIZZER = 11
}

interface Achievement {
  type: AchievementType;
  name: string;
  unlocked: boolean;
}

interface AchievementsDisplayProps {
  userXP: number;
  streak: number;
  level: number;
}

export default function AchievementsDisplay({ userXP, streak, level }: AchievementsDisplayProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Check for new achievements when stats change
  useEffect(() => {
    checkForNewAchievements();
  }, [userXP, streak, level]);

  // Check for new achievements based on current stats
  const checkForNewAchievements = async () => {
    try {
      console.log('=== CHECKING FOR NEW ACHIEVEMENTS ===');
      console.log('Current stats:', { userXP, streak, level });
      
      const newAchievements: Achievement[] = [];

      // Check XP-based achievements
      if (userXP >= 100) {
        newAchievements.push({ type: AchievementType.XP_100, name: 'XP Collector', unlocked: true });
      }
      if (userXP >= 500) {
        newAchievements.push({ type: AchievementType.XP_500, name: 'XP Enthusiast', unlocked: true });
      }
      if (userXP >= 1000) {
        newAchievements.push({ type: AchievementType.XP_1000, name: 'XP Master', unlocked: true });
      }
      if (userXP >= 2000) {
        newAchievements.push({ type: AchievementType.MASTER_QUIZZER, name: 'Master Quizzer', unlocked: true });
      }

      // Check streak-based achievements (must meet both streak AND XP requirements)
      if (streak >= 5 && userXP >= 25) {
        newAchievements.push({ type: AchievementType.STREAK_5, name: 'Streak Master', unlocked: true });
      }
      if (streak >= 10 && userXP >= 50) {
        newAchievements.push({ type: AchievementType.STREAK_10, name: 'Unstoppable', unlocked: true });
      }
      if (streak >= 25 && userXP >= 125) {
        newAchievements.push({ type: AchievementType.STREAK_25, name: 'Legendary Streak', unlocked: true });
      }

      // Check level-based achievements (must meet both level AND XP requirements)
      if (level >= 10 && userXP >= 50) {
        newAchievements.push({ type: AchievementType.LEVEL_10, name: 'Level 10 Unlocked', unlocked: true });
      }
      if (level >= 25 && userXP >= 125) {
        newAchievements.push({ type: AchievementType.LEVEL_25, name: 'Level 25 Unlocked', unlocked: true });
      }
      if (level >= 50 && userXP >= 250) {
        newAchievements.push({ type: AchievementType.LEVEL_50, name: 'Level 50 Unlocked', unlocked: true });
      }
      if (level >= 100 && userXP >= 500) {
        newAchievements.push({ type: AchievementType.LEVEL_100, name: 'Century Club', unlocked: true });
      }

      console.log('New achievements found:', newAchievements);

      // Update achievements state
      setAchievements(newAchievements);
      
      if (newAchievements.length > 0) {
        toast.success(`🎉 ${newAchievements.length} new achievement${newAchievements.length > 1 ? 's' : ''} unlocked!`);
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  // Get achievement icon
  const getAchievementIcon = (achievementType: AchievementType) => {
    switch (achievementType) {
      case AchievementType.FIRST_PERFECT_SCORE:
        return <Trophy className="h-5 w-5" />;
      case AchievementType.STREAK_5:
      case AchievementType.STREAK_10:
      case AchievementType.STREAK_25:
        return <Flame className="h-5 w-5" />;
      case AchievementType.LEVEL_10:
      case AchievementType.LEVEL_25:
      case AchievementType.LEVEL_50:
      case AchievementType.LEVEL_100:
        return <Star className="h-5 w-5" />;
      case AchievementType.XP_100:
      case AchievementType.XP_500:
      case AchievementType.XP_1000:
        return <Zap className="h-5 w-5" />;
      case AchievementType.MASTER_QUIZZER:
        return <Trophy className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  // Get achievement description
  const getAchievementDescription = (achievementType: AchievementType) => {
    switch (achievementType) {
      case AchievementType.FIRST_PERFECT_SCORE:
        return 'Achieved your first perfect score!';
      case AchievementType.STREAK_5:
        return '5 perfect scores in a row!';
      case AchievementType.STREAK_10:
        return '10 perfect scores in a row!';
      case AchievementType.STREAK_25:
        return '25 perfect scores in a row!';
      case AchievementType.LEVEL_10:
        return 'Reached level 10!';
      case AchievementType.LEVEL_25:
        return 'Reached level 25!';
      case AchievementType.LEVEL_50:
        return 'Reached level 50!';
      case AchievementType.LEVEL_100:
        return 'Reached level 100!';
      case AchievementType.XP_100:
        return 'Earned 100 XP!';
      case AchievementType.XP_500:
        return 'Earned 500 XP!';
      case AchievementType.XP_1000:
        return 'Earned 1000 XP!';
      case AchievementType.MASTER_QUIZZER:
        return 'The ultimate achievement!';
      default:
        return 'Unknown achievement';
    }
  };

  // Helper functions for next milestones
  function getNextXPMilestone(currentXP: number) {
    if (currentXP < 100) return 100;
    if (currentXP < 500) return 500;
    if (currentXP < 1000) return 1000;
    if (currentXP < 2000) return 2000;
    return 2000;
  }

  function getNextStreakMilestone(currentStreak: number) {
    if (currentStreak < 5) return 5;
    if (currentStreak < 10) return 10;
    if (currentStreak < 25) return 25;
    return 25;
  }

  function getNextLevelMilestone(currentLevel: number) {
    if (currentLevel < 10) return 10;
    if (currentLevel < 25) return 25;
    if (currentLevel < 50) return 50;
    if (currentLevel < 100) return 100;
    return 100;
  }

  const nextXP = getNextXPMilestone(userXP);
  const nextStreak = getNextStreakMilestone(streak);
  const nextLevel = getNextLevelMilestone(level);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Progress to Next Achievement</h4>
            
            {/* XP Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-medium">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  XP Progress
                </span>
                <span className="text-sm text-muted-foreground">
                  {userXP} / {nextXP}
                </span>
              </div>
              <Progress value={(userXP / nextXP) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {userXP >= 2000 ? 'All XP achievements unlocked!' : `Next milestone: ${nextXP} XP`}
              </p>
            </div>

            {/* Streak Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-medium">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Streak Progress
                </span>
                <span className="text-sm text-muted-foreground">
                  {streak} / {nextStreak}
                </span>
              </div>
              <Progress value={(streak / nextStreak) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {streak >= 25 ? 'All streak achievements unlocked!' : `Next milestone: ${nextStreak} streak`}
              </p>
            </div>

            {/* Level Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-medium">
                  <Star className="h-4 w-4 text-blue-500" />
                  Level Progress
                </span>
                <span className="text-sm text-muted-foreground">
                  {level} / {nextLevel}
                </span>
              </div>
              <Progress value={(level / nextLevel) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {level >= 100 ? 'All level achievements unlocked!' : `Next milestone: Level ${nextLevel}`}
              </p>
            </div>
          </div>

          {/* Unlocked Achievements */}
          {achievements.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Unlocked Achievements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.type}
                    className="flex flex-col justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800 h-full"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-green-600 dark:text-green-400 flex items-center">
                        {getAchievementIcon(achievement.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-900 dark:text-green-100">
                          {achievement.name}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {getAchievementDescription(achievement.type)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        Unlocked
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Achievements */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Upcoming Achievements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* XP Achievements */}
              {userXP < 100 && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <Zap className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium">XP Collector</p>
                    <p className="text-sm text-muted-foreground">Earn 100 XP</p>
                  </div>
                  <Badge variant="outline">{userXP}/100</Badge>
                </div>
              )}
              {userXP < 500 && userXP >= 100 && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <Zap className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium">XP Enthusiast</p>
                    <p className="text-sm text-muted-foreground">Earn 500 XP</p>
                  </div>
                  <Badge variant="outline">{userXP}/500</Badge>
                </div>
              )}

              {/* Streak Achievements */}
              {streak < 5 && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <Flame className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium">Streak Master</p>
                    <p className="text-sm text-muted-foreground">5 perfect scores in a row</p>
                  </div>
                  <Badge variant="outline">{streak}/5</Badge>
                </div>
              )}
              {streak < 10 && streak >= 5 && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <Flame className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium">Unstoppable</p>
                    <p className="text-sm text-muted-foreground">10 perfect scores in a row</p>
                  </div>
                  <Badge variant="outline">{streak}/10</Badge>
                </div>
              )}

              {/* Level Achievements */}
              {level < 10 && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <Star className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium">Level 10 Unlocked</p>
                    <p className="text-sm text-muted-foreground">Reach level 10</p>
                  </div>
                  <Badge variant="outline">{level}/10</Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 