import React from 'react';

interface HiveBlockProps {
  onClick: () => void;
  selected: boolean;
  name: string;
  description: string;
}

const HiveBlock: React.FC<HiveBlockProps> = ({ onClick, selected, name, description }) => {
  return (
    <div onClick={onClick} className={`w-full cursor-pointer rounded-md border-[1.5px] p-4 transition-all ${selected ? 'border-white border-opacity-25 bg-white bg-opacity-5' : 'border-white border-opacity-10 bg-opacity-10 opacity-50 hover:opacity-100'}`}>
      <h2 className="text-[24px] font-bold">{name}</h2>
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
