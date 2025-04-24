/*
'use client';
import { auth0 } from '@/lib/auth0';
import Question from './components/home/Question';
import Answer from './components/home/Answer';
import Questionbar from './components/home/Questionbar';
import { useActiveChatContext } from './context/activeChatContext';

export default async function Home() {
  const session = await auth0.getSession();
  const { messages, addMessage, updateMessages } = useActiveChatContext();

  async function handleSubmit(message: string) {
    addMessage(message);

    try {
      const res = await fetch('http://localhost:3001/api/chat/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      console.log('Message has been sent from front-end...');
      const data = await res.json();
      updateMessages(data.message.answer);
    } catch (error) {
      console.error('Error fetching response:', error);
      updateMessages('Error: Unable to fetch response');
    }
  }

  if (!session) {
    return (
      <main>
        <a href="/auth/login?screen_hint=signup">
          <button>Sign up</button>
        </a>
        <a href="/auth/login">
          <button>Log in</button>
        </a>
      </main>
    );
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
*/
import { auth0 } from '@/lib/auth0';
import './globals.css';

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  // If no session, show sign-up and login buttons
  if (!session) {
    return (
      <main>
        <a href="/auth/login?screen_hint=signup">
          <button>Sign up</button>
        </a>
        <a href="/auth/login">
          <button>Log in</button>
        </a>
      </main>
    );
  }

  // If session exists, show a welcome message and logout button
  return (
    <main>
      <h1>Welcome, {session.user.name}!</h1>
      <p>
        <a href="/auth/logout">
          <button>Log out</button>
        </a>
      </p>
    </main>
  );
}
