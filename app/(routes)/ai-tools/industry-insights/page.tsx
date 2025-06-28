"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building2, Users, Globe, BarChart3, Target } from 'lucide-react';

const IndustryInsights = () => {
  const insights = [
    {
      title: "Tech Industry Trends",
      description: "Latest developments in software development, AI, and emerging technologies",
      icon: <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      stats: "15% growth",
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Healthcare & Biotech",
      description: "Innovations in medical technology and pharmaceutical developments",
      icon: <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />,
      stats: "22% growth",
      color: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Finance & Fintech",
      description: "Digital banking, cryptocurrency, and financial technology trends",
      icon: <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      stats: "18% growth",
      color: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Remote Work Evolution",
      description: "How companies are adapting to hybrid and remote work models",
      icon: <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
      stats: "35% adoption",
      color: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      title: "Global Market Analysis",
      description: "International business trends and market opportunities",
      icon: <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      stats: "12% expansion",
      color: "bg-indigo-100 dark:bg-indigo-900/30"
    },
    {
      title: "Career Opportunities",
      description: "High-demand roles and skills for the next decade",
      icon: <Target className="h-6 w-6 text-red-600 dark:text-red-400" />,
      stats: "25% increase",
      color: "bg-red-100 dark:bg-red-900/30"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Industry Insights</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stay ahead of the curve with comprehensive industry analysis, market trends, and career opportunities across various sectors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${insight.color}`}>
                  {insight.icon}
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">{insight.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{insight.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Growth Rate</span>
                <span className="text-lg font-bold text-primary">{insight.stats}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Coming Soon</CardTitle>
          <CardDescription className="text-muted-foreground">
            We're working on detailed industry reports, salary insights, and personalized career recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our AI-powered insights engine is being trained on the latest market data to provide you with the most accurate and up-to-date industry information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryInsights; 