import React from 'react';

interface HiveBarProps {
  selected: boolean;
  name: string;
  description: string;
}

const HiveBar: React.FC<HiveBarProps> = ({ selected, name, description }) => {
  return (
    <div className={selected ? 'w-full rounded-md border-[1.5px] border-white border-opacity-25 bg-white bg-opacity-5 p-4' : 'w-full rounded-md border-[1.5px] border-white border-opacity-10 bg-opacity-10 p-4 opacity-50'}>
      <h2 className="text-[24px] font-bold">{name}</h2>
      <p>{description}.</p>
      <div className="my-2 h-[1.5px] w-full rounded-full bg-white bg-opacity-10"></div>
      <div className="flex flex-wrap gap-2">
        {' '}
        <small className="rounded-md bg-green-200 bg-opacity-10 p-2 text-[14px] font-normal text-green-200">GPT-4o</small>
        <small className="rounded-md bg-orange-200 bg-opacity-10 p-2 text-[14px] font-normal text-orange-200">Claude 3.5 Sonnet</small>
        <small className="rounded-md bg-blue-200 bg-opacity-10 p-2 text-[14px] font-normal text-blue-200">DeepSeek R1</small>
      </div>
      <div className="my-2 h-[1.5px] w-full rounded-full bg-white bg-opacity-10"></div>
      <div className="flex w-full justify-end gap-2">
        <button className="rounded-md bg-white p-2 px-4 text-black">Modify</button>
        <button className="rounded-md bg-red-600 px-4 py-2 text-white">Delete</button>
      </div>
    </div>
  );
};

export default HiveBar;
