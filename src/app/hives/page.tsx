'use client';
import React, { useState } from 'react';
import HiveBlock from './components/HiveBlock';
import { useAppContext } from '../context/activeHiveContext';

const HivesPage = () => {
  const { activeHive, setActiveHive } = useAppContext();

  return (
    <div className="flex h-[100%] flex-col items-center font-albert">
      <div className="flex w-[800px] flex-col items-start justify-end gap-2 py-10 font-albert text-[32px] font-bold">
        <h1>Getting Started with Hive {activeHive}</h1>
        <div className="h-[200px] w-full rounded-md bg-black"></div>
      </div>
      <div className="flex w-[800px] flex-col items-start justify-end gap-2">
        <h2 className="font-albert text-[32px] font-bold">Pre-made Models</h2>
        <div className="flex w-full gap-4">
          <HiveBlock onClick={() => setActiveHive('allround-hive')} selected={activeHive === 'allround-hive'} name="Allround Hive" description="Better at allround problem solving" />
          <HiveBlock onClick={() => setActiveHive('coding-hive')} selected={activeHive === 'coding-hive'} name="Coding Hive" description="Better at completing coding tasks" />
          <HiveBlock onClick={() => setActiveHive('reasoning-hive')} selected={activeHive === 'reasoning-hive'} name="Reasoning Hive" description="Uses deep thinking to provide reasoned answers" />
        </div>
      </div>
    </div>
  );
};

export default HivesPage;
