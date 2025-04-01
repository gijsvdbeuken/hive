'use client';
import React, { useState } from 'react';
import { useAppContext } from '../../context/activeHiveContext';

const Questionbar = ({ onSubmit }: { onSubmit: (question: string) => void }) => {
  const { activeHive } = useAppContext();
  const [question, setQuestion] = useState('');

  function handleSubmit() {
    if (question.trim()) {
      onSubmit(question);
      setQuestion('');
    }
  }

  return (
    <div className="my-4 flex w-[100%] flex-row items-center rounded-full bg-white bg-opacity-10 p-1">
      <div className="flex h-full items-center whitespace-nowrap rounded-full border-opacity-20 bg-white bg-opacity-10 px-5 font-albert font-normal text-white">{activeHive}</div>
      <input value={question} onChange={(e) => setQuestion(e.target.value)} className="h-[40px] w-[100%] bg-transparent p-2 font-albert font-normal placeholder-opacity-5" />
      <button onClick={handleSubmit} disabled={!question.trim()} className={`h-[40px] w-[40px] flex-shrink-0 rounded-full ${!question.trim() ? 'bg-white bg-opacity-20 text-white text-opacity-50' : 'bg-white text-black'}`}>
        <i className="fas fa-solid fa-arrow-up"></i>
      </button>
    </div>
  );
};

export default Questionbar;
