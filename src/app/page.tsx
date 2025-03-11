'use client';
import { useState } from 'react';
import Question from './components/Question';
import Answer from './components/Answer';
import Questionbar from './components/Questionbar';

export default function Home() {
  const [messages, setMessages] = useState<{ question: string; answer?: string }[]>([]);

  async function handleSubmit(question: string) {
    setMessages([...messages, { question, answer: undefined }]);
    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setMessages((prev) => prev.map((msg, index) => (index === prev.length - 1 ? { ...msg, answer: data.content } : msg)));
  }

  return (
    <div className="flex h-[100%] flex-col items-center justify-end font-albert">
      <div className="flex w-[800px] flex-col items-center justify-end font-albert">
        {messages.map((msg, index) => (
          <div key={index} className="flex w-full flex-col">
            <Question question={msg.question} />
            <Answer answer={msg.answer ?? 'Aan het nadenken...'} />
          </div>
        ))}
        <Questionbar onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
