'use client';
import { createContext, useState, useContext } from 'react';

interface Message {
  question: string;
  answer?: string;
}

interface ActiveChatContextType {
  messages: Message[];
  addMessage: (question: string) => void;
  updateMessages: (answer: string) => void;
  clearMessages: () => void;
}

const ActiveChatContext = createContext<ActiveChatContextType | undefined>(undefined);

export function ActiveChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  function addMessage(question: string) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        question,
        answer: 'Aan het nadenken...',
      },
    ]);
  }

  function updateMessages(answer: string) {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      if (updatedMessages.length > 0) {
        updatedMessages[updatedMessages.length - 1].answer = answer;
      }
      return updatedMessages;
    });
  }

  function clearMessages() {
    setMessages([]);
  }

  return (
    <ActiveChatContext.Provider
      value={{
        messages,
        addMessage,
        updateMessages: updateMessages,
        clearMessages,
      }}
    >
      {children}
    </ActiveChatContext.Provider>
  );
}

export function useActiveChatContext() {
  const context = useContext(ActiveChatContext);
  if (!context) {
    throw new Error('useActiveChatContext must be used within an ActiveChatProvider');
  }
  return context;
}
