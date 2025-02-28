'use client';
import { useState } from 'react';
import UserMessage from './components/UserMessage';
import HiveMessage from './components/HiveMessage';
import Questionbar from './components/Questionbar';

export default function Home() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  async function handleSubmit(question: string) {
    setQuestions([...questions, question]);
    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswers([...answers, data.content]);
  }

  return (
    <div className="flex h-[100%] flex-col items-center justify-end font-albert">
      <div className="flex w-[800px] flex-col items-center justify-end font-albert">
        {questions.map((question, index) => (
          <UserMessage key={index} question={question} />
        ))}
        {answers.map((answer, index) => (
          <HiveMessage key={index} answer={answer} />
        ))}
        <Questionbar onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
