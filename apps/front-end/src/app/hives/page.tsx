'use client';
import React, { useEffect } from 'react';
import HiveBlock from './components/HiveBlock';
import { useAppContext } from '../context/activeHiveContext';
//import { useUser } from '@auth0/nextjs-auth0/client';

const HivesPage = () => {
  //const { user, isLoading } = useUser();
  const { activeHive, setActiveHive } = useAppContext();

  useEffect(() => {
    if (!activeHive) return;
    function generateUniqueId(length = 10) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
    const storeActiveHive = async () => {
      try {
        // Change this later to retrieve dynamically
        const ownerId = 'auth0|6554d3ba6ac7eefb66a50028';

        const uniqueId = generateUniqueId();
        const hiveId = `my-research-hive_${uniqueId}`;
        const largeLanguageModels = ['GPT-4o', 'GPT-4o-mini', 'Claude 3.5 Sonnet'];

        console.log('Throwing request to api-gateway...');
        await fetch('http://localhost:3001/api/hives', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ownerId: ownerId, hiveId: hiveId, largeLanguageModels: largeLanguageModels }),
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
