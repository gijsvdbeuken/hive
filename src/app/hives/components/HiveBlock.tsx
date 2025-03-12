import React from 'react';

interface HiveBlockProps {
  selected: boolean;
  name: string;
  description: string;
}

const HiveBlock: React.FC<HiveBlockProps> = ({ selected, name, description }) => {
  return (
    <div className={selected ? 'w-full rounded-md border-[1.5px] border-white border-opacity-25 bg-white bg-opacity-5 p-4' : 'w-full rounded-md border-[1.5px] border-white border-opacity-10 bg-opacity-10 p-4 opacity-75'}>
      <h2 className="text-[32px] font-bold">{name}</h2>
      <p>{description}.</p>
      <div className="my-2 h-[1.5px] w-full rounded-full bg-white bg-opacity-10"></div>
      <div className="flex flex-wrap gap-2">
        {' '}
        <small className="rounded-md bg-green-200 bg-opacity-10 p-2 text-[14px] font-normal text-green-200">GPT-4o</small>
        <small className="rounded-md bg-orange-200 bg-opacity-10 p-2 text-[14px] font-normal text-orange-200">Claude 3.5 Sonnet</small>
        <small className="rounded-md bg-blue-200 bg-opacity-10 p-2 text-[14px] font-normal text-blue-200">DeepSeek R1</small>
      </div>
    </div>
  );
};

export default HiveBlock;
