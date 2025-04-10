'use client';
import Question from './components/home/Question';
import Answer from './components/home/Answer';
import Questionbar from './components/home/Questionbar';
import { useActiveChatContext } from './context/activeChatContext';

export default function Home() {
  const { messages, addMessage, updateMessages } = useActiveChatContext();

  async function handleSubmit(message: string) {
    addMessage(message);

    try {
      const res = await fetch('http://localhost:3002/chat/openai', {
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
    </div>
  );
}
