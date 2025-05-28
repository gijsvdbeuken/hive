'use client';
import React, { useEffect, useState } from 'react';
import HiveBlock from './components/HiveBlock';
import { useAppContext } from '../context/activeHiveContext';

type UserModel = {
  id: string;
  title: string;
  models: string[];
};

const availableLLMs = ['GPT-4', 'GPT-4o', 'Claude 3.5 Sonnet', 'Claude 3 Opus', 'Gemini 1.5 Pro', 'GPT-4o-mini', 'GPT-3.5 Turbo'];

const HivesPage = () => {
  const { activeHive, setActiveHive } = useAppContext();

  const [userModels, setUserModels] = useState<UserModel[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedLLMs, setSelectedLLMs] = useState<string[]>([]);

  const deleteModel = (id: string) => {
    setUserModels((prev) => prev.filter((model) => model.id !== id));
  };

  const toggleLLM = (llm: string) => {
    setSelectedLLMs((prev) => (prev.includes(llm) ? prev.filter((item) => item !== llm) : [...prev, llm]));
  };

  const createModel = () => {
    if (!newTitle || selectedLLMs.length === 0) return;

    const id = `model-${Date.now()}`;
    const newModel: UserModel = {
      id,
      title: newTitle,
      models: selectedLLMs,
    };

    setUserModels((prev) => [...prev, newModel]);
    setActiveHive(newTitle);
    setNewTitle('');
    setSelectedLLMs([]);
  };

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
          body: JSON.stringify({ ownerId, hiveId, largeLanguageModels }),
        });
      } catch (error) {
        console.error('Error fetching response:', error);
      }
    };

    storeActiveHive();
  }, [activeHive]);

  return (
    <div className="flex h-full flex-col items-center space-y-10 pb-20 font-albert text-white">
      {/* Getting Started */}
      <section className="mt-10 w-[800px] rounded-md">
        <h1 className="mb-4 text-[32px] font-bold">Getting Started with Hive</h1>
        <div className="h-[200px] w-full rounded-md bg-white/5"></div>
      </section>

      {/* Create Custom Model */}
      <section className="w-[800px] rounded-md bg-white/5 p-6">
        <h2 className="mb-4 text-[32px] font-bold">Create Custom Model</h2>

        <input className="mb-4 w-full rounded bg-white/10 p-2 text-white placeholder-white/50 focus:outline-none" placeholder="Model collection name" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />

        <div className="mb-4 flex flex-wrap gap-2">
          {availableLLMs.map((llm) => (
            <div key={llm} onClick={() => toggleLLM(llm)} className={`cursor-pointer rounded-md border-[1.5px] p-3 text-sm transition-all ${selectedLLMs.includes(llm) ? 'border-white border-opacity-25 bg-white bg-opacity-5' : 'border-white border-opacity-10 bg-opacity-10 opacity-50 hover:opacity-100'}`}>
              {llm}
            </div>
          ))}
        </div>

        <button onClick={createModel} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Create
        </button>
        <h2 className="mb-4 mt-10 text-[32px] font-bold">Your Models</h2>
        <div className="flex flex-wrap gap-4">
          {userModels.length > 0 ? (
            userModels.map((model) => (
              <div key={model.id} className={`flex w-[calc(50%-0.5rem)] cursor-pointer flex-col gap-2 rounded-md bg-white/5 p-4 shadow ${activeHive === model.title ? 'ring-2 ring-white/25' : ''}`} onClick={() => setActiveHive(model.title)}>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{model.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteModel(model.id);
                    }}
                    className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
                <ul className="list-inside list-disc text-sm text-white/80">
                  {model.models.map((m, index) => (
                    <li key={index}>{m}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-white/50">No custom models yet.</p>
          )}
        </div>
      </section>

      {/* Pre-made Models */}
      <section className="w-[800px] rounded-md bg-white/5 p-6">
        <h2 className="mb-4 text-[32px] font-bold">Pre-made Models</h2>
        <div className="flex flex-wrap gap-4">
          <HiveBlock onClick={() => setActiveHive('Allround Hive')} selected={activeHive === 'Allround Hive'} name="Allround Hive" description="Better at allround problem solving" />
          <HiveBlock onClick={() => setActiveHive('Coding Hive')} selected={activeHive === 'Coding Hive'} name="Coding Hive" description="Better at completing coding tasks" />
          <HiveBlock onClick={() => setActiveHive('Reasoning Hive')} selected={activeHive === 'Reasoning Hive'} name="Reasoning Hive" description="Uses deep thinking to provide reasoned answers" />
        </div>
      </section>
    </div>
  );
};

export default HivesPage;
