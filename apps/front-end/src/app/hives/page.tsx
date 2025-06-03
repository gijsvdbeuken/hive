'use client';
import React, { useEffect, useState } from 'react';
import HiveBlock from './components/HiveBlock';
import { useAppContext } from '../context/activeHiveContext';
import { useSession } from '../components/SessionProvider';

type UserModel = {
  id: string;
  title: string;
  models: string[];
};

const availableLLMs = ['GPT-4', 'GPT-4o', 'Claude 3.5 Sonnet', 'Claude 3 Opus', 'Gemini 1.5 Pro', 'GPT-4o-mini', 'GPT-3.5 Turbo'];

const API_BASE = `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/hives`;

const HivesPage = () => {
  const session = useSession();
  const { activeHive, setActiveHive } = useAppContext();

  const [userModels, setUserModels] = useState<UserModel[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedLLMs, setSelectedLLMs] = useState<string[]>([]);

  useEffect(() => {
    if (!session?.user?.sub) return;

    const fetchUserModels = async () => {
      try {
        const res = await fetch(`${API_BASE}/${session?.user?.sub}`);
        if (!res.ok) throw new Error('Failed to fetch hives');

        const data = await res.json();
        setUserModels(data.hives || []);
      } catch (err) {
        console.error('Failed to load user hives:', err);
      }
    };

    fetchUserModels();
  }, [session?.user?.sub]);

  const toggleLLM = (llm: string) => {
    setSelectedLLMs((prev) => (prev.includes(llm) ? prev.filter((item) => item !== llm) : [...prev, llm]));
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/${session?.user?.sub}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete hive');

      setUserModels((prev) => prev.filter((model) => model.id !== id));
    } catch (err) {
      console.error('Error deleting hive:', err);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || selectedLLMs.length < 2) {
      console.warn('Please enter a title and select at least 2 language models.');
      return;
    }

    const normalizedTitle = newTitle.trim().toLowerCase();
    const exists = userModels.some((model) => model.title.trim().toLowerCase() === normalizedTitle);

    if (exists) {
      console.warn('A model with this title already exists.');
      return;
    }

    const id = normalizedTitle.replace(/\s+/g, '-');

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: session?.user?.sub,
          hiveId: id,
          largeLanguageModels: selectedLLMs,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Backend error:', error);
        return;
      }

      const newModel: UserModel = {
        id,
        title: newTitle,
        models: selectedLLMs,
      };

      setUserModels((prev) => [...prev, newModel]);
      setActiveHive(newTitle);
      setNewTitle('');
      setSelectedLLMs([]);
    } catch (err) {
      console.error('Error creating model:', err);
    }
  };

  if (!session?.user?.sub || !session?.user?.sub) return null;

  return (
    <div className="flex h-full flex-col items-center space-y-10 pb-20 font-albert text-white">
      {/* Getting Started */}
      <section className="mt-10 w-[800px] rounded-md">
        <h1 className="mb-4 text-[32px] font-bold">Getting Started with Hive</h1>
        <div className="h-[200px] w-full rounded-md bg-white/5" />
      </section>

      {/* Create Custom Model */}
      <section className="w-[800px] rounded-md bg-white/5 p-6">
        <h2 className="mb-4 text-[32px] font-bold">Create Custom Model</h2>

        <input className="mb-4 w-full rounded bg-white/10 p-2 text-white placeholder-white/50 focus:outline-none" placeholder="Model collection name" value={newTitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)} />

        <div className="mb-4 flex flex-wrap gap-2">
          {availableLLMs.map((llm) => (
            <label key={llm} className={`cursor-pointer rounded-md border-[1.5px] px-3 py-2 text-sm transition-all ${selectedLLMs.includes(llm) ? 'border-white border-opacity-25 bg-white bg-opacity-5' : 'border-white border-opacity-10 bg-opacity-10 opacity-50 hover:opacity-100'}`}>
              <input type="checkbox" value={llm} checked={selectedLLMs.includes(llm)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => toggleLLM(e.target.value)} className="mr-2 accent-blue-500" />
              {llm}
            </label>
          ))}
        </div>

        <p className="mb-4 text-sm text-white/60">Select at least 2 language models to create a hive</p>

        <button onClick={handleCreate} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
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
                      handleDelete(model.id);
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
