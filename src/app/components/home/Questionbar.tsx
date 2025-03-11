'use client';
import React, { useState } from 'react';

const Questionbar = ({ onSubmit }: { onSubmit: (question: string) => void }) => {
  const [question, setQuestion] = useState('');

  function handleSubmit() {
    if (question.trim()) {
      onSubmit(question);
      setQuestion('');
    }
  }

  return (
    <div className="my-4 flex w-[100%] flex-row items-center rounded-full bg-white bg-opacity-10">
      <div className="mx-1 flex h-[40px] items-center rounded-full border-opacity-20 bg-white bg-opacity-10 px-5 font-albert font-normal text-white">Opus</div>
      <input value={question} onChange={(e) => setQuestion(e.target.value)} className="h-[50px] w-[100%] bg-transparent p-2 font-albert font-normal placeholder-opacity-5"></input>
      <button onClick={handleSubmit} disabled={!question.trim()} className={`mx-1 h-[40px] w-[40px] flex-shrink-0 rounded-full ${!question.trim() ? 'bg-white bg-opacity-20 text-white text-opacity-50' : 'bg-white text-black'} `}>
        <i className="fas fa-solid fa-arrow-up"></i>
      </button>
    </div>
  );
};

export default Questionbar;
