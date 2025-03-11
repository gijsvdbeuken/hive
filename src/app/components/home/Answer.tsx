import React from 'react';

const Answer = ({ answer }: { answer: string }) => {
  return (
    <div className="flex w-full flex-row justify-start">
      <div className="mt-5 h-5 w-5 flex-shrink-0 rounded-full bg-orange-500"></div>
      <div className="rounded-md px-3 py-5">{answer}</div>
    </div>
  );
};

export default Answer;
