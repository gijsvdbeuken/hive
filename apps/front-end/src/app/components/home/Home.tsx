'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Question from './Question';
import Answer from './Answer';
import Questionbar from './Questionbar';
import { useActiveChatContext } from '../../context/activeChatContext';

type CustomSession = {
  user: {
    name?: string;
    email?: string;
    picture?: string;
    sub: string;
  };
};

export default function ClientHome({ session }: { session: CustomSession | null }) {
  const { messages, addMessage, updateMessages } = useActiveChatContext();

  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  async function handleSubmit(message: string) {
    addMessage(message);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/api/chat/openai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      updateMessages(data.message.answer);
    } catch (error) {
      console.error('Error fetching response:', error);
      updateMessages('Error: Unable to fetch response');
    }
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
      <a href="/auth/logout">
        <button>Log out</button>
      </a>
    </div>
  );
}
