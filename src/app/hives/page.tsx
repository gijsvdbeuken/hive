import React from 'react';
import HiveBlock from './components/HiveBlock';

const HivesPage = () => {
  return (
    <div className="flex h-[100%] flex-col items-center font-albert">
      <div className="flex w-[800px] flex-col items-start justify-end gap-2 py-10 font-albert text-[32px] font-bold">
        <h1>Getting Started with Hive</h1>
        <div className="h-[200px] w-full rounded-md bg-white bg-opacity-25"></div>
      </div>
      <div className="flex w-[800px] flex-col items-start justify-end gap-2">
        <h2 className="font-albert text-[32px] font-bold">Pre-made Models</h2>
        <div className="flex w-full gap-4">
          <HiveBlock selected={true} name="One" description="Better at coding and math related problem solving" />
          <HiveBlock selected={false} name="Two" description="Better at coding and math related problem solving" />
          <HiveBlock selected={false} name="Three" description="Better at coding and math related problem solving" />
        </div>
      </div>
      <div className="flex w-[800px] flex-col items-start justify-end gap-2 py-10">
        <h2 className="font-albert text-[32px] font-bold">Custom Models</h2>
        <div className="flex w-full gap-4">
          <HiveBlock selected={true} name="One" description="Better at coding and math related problem solving" />
        </div>
      </div>
    </div>
  );
};

export default HivesPage;
