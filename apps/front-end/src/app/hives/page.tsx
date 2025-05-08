'use client';
import React, { useEffect } from 'react';
import HiveBlock from './components/HiveBlock';
import { useAppContext } from '../context/activeHiveContext';

const HivesPage = () => {
  const { activeHive, setActiveHive } = useAppContext();

  useEffect(() => {
    if (!activeHive) return;

    /*
    const storeActiveHive = async () => {
      try {
        await fetch('http://localhost:3001/api/batches/save-active-hive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ activeHive: activeHive }),
        });
      } catch (error) {
        console.error('Error fetching response:', error);
      }
    };
    */

    const storeActiveHive = async () => {
      try {
        const timestamp = Date.now();
        const randomPart = Math.random().toString(36).substring(2, 8);
        const uniqueHiveId = `hive_${timestamp}_${randomPart}`;

        await fetch('http://localhost:3001/api/batches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ hiveId: uniqueHiveId, models: ['gpt-4', 'claude-3'] }),
        });
      } catch (error) {
        console.error('Error fetching response:', error);
      }
    };

    storeActiveHive();
  }, [activeHive]);

  return (
    <div className="flex h-[100%] flex-col items-center font-albert">
      <div className="flex w-[800px] flex-col items-start justify-end gap-2 py-10 font-albert text-[32px] font-bold">
        <h1>Getting Started with Hive</h1>
        <div className="h-[200px] w-full rounded-md bg-black"></div>
      </div>
      <div className="flex w-[800px] flex-col items-start justify-end gap-2">
        <h2 className="font-albert text-[32px] font-bold">Pre-made Models</h2>
        <div className="flex w-full gap-4">
          <HiveBlock onClick={() => setActiveHive('Allround Hive')} selected={activeHive === 'Allround Hive'} name="Allround Hive" description="Better at allround problem solving" />
          <HiveBlock onClick={() => setActiveHive('Coding Hive')} selected={activeHive === 'Coding Hive'} name="Coding Hive" description="Better at completing coding tasks" />
          <HiveBlock onClick={() => setActiveHive('Reasoning Hive')} selected={activeHive === 'Reasoning Hive'} name="Reasoning Hive" description="Uses deep thinking to provide reasoned answers" />
        </div>
      </div>
    </div>
  );
};

export default HivesPage;
