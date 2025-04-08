import React from 'react';

const Question = ({ question }: { question: string }) => {
  return (
    <div className="flex w-[100%] flex-row justify-end">
      <div className="rounded-md bg-white bg-opacity-10 px-6 py-4">{question}</div>
    </div>
  );
};

export default Question;
