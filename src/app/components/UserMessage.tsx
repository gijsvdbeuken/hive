import React from "react";

const UserMessage = ({ question }: { question: string }) => {
  return (
    <div className="flex w-[100%] flex-row justify-end">
      <div className="rounded-md bg-white bg-opacity-10 p-5">{question}</div>
    </div>
  );
};

export default UserMessage;
