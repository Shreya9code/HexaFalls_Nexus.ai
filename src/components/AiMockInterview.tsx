import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const QUESTION_COUNT = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || '5';
const INFORMATION = process.env.NEXT_PUBLIC_INFORMATION || 'You are a senior software engineer conducting a technical interview.';
const QUESTION_NOTE = process.env.NEXT_PUBLIC_QUESTION_NOTE || 'Ask one technical question at a time.';

export default function AiMockInterview() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `${INFORMATION} Generate ${QUESTION_COUNT} technical interview questions. ${QUESTION_NOTE} Format the response as a JSON array of strings.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        // Try to parse the response as JSON
        const parsedQuestions = JSON.parse(text);
        if (Array.isArray(parsedQuestions)) {
          setQuestions(parsedQuestions);
        } else {
          throw new Error('Response is not an array');
        }
      } catch (parseError) {
        // If JSON parsing fails, try to extract questions from the text
        const questionMatches = text.match(/\d+\.\s*([^\n]+)/g);
        if (questionMatches) {
          const extractedQuestions = questionMatches.map(q => q.replace(/^\d+\.\s*/, '').trim());
          setQuestions(extractedQuestions);
        } else {
          throw new Error('Could not extract questions from response');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div>
        <h2>Interview Complete!</h2>
        <div>
          {questions.map((q, i) => (
            <div key={i}>
              <p><strong>Q: {q}</strong></p>
              <p>A: {answers[i]}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
      <p>{questions[currentQuestionIndex]}</p>
      <textarea
        onChange={(e) => handleAnswer(e.target.value)}
        placeholder="Type your answer here..."
      />
    </div>
  );
} 