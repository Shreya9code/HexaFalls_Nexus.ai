import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle, TrendingUp, FileText, Target, Users, Award } from 'lucide-react'

interface EmptyStateProps {
  selectedQuestion: (question: string) => void
}

const EmptyState = ({ selectedQuestion }: EmptyStateProps) => {
  const suggestedQuestions = [
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      question: "How can I transition from my current role to a more senior position?",
      category: "Career Growth"
    },
    {
      icon: <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />,
      question: "What skills should I highlight on my resume for a software engineering role?",
      category: "Resume & Skills"
    },
    {
      icon: <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      question: "Can you help me create a 5-year career roadmap?",
      category: "Planning"
    },
    {
      icon: <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
      question: "What are common interview questions for product managers?",
      category: "Interviews"
    },
    {
      icon: <Award className="h-5 w-5 text-red-600 dark:text-red-400" />,
      question: "How do I negotiate a better salary offer?",
      category: "Negotiation"
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      question: "What networking strategies work best in tech?",
      category: "Networking"
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestedQuestions.map((item, index) => (
          <Card 
            key={index} 
            className="border-border bg-card hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] group"
            onClick={() => selectedQuestion(item.question)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {item.category}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed group-hover:text-primary transition-colors">
                    {item.question}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default EmptyState
