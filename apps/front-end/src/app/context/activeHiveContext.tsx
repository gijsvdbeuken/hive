'use client';
import { createContext, useState, useContext, ReactNode } from 'react';

interface ActiveHiveContextType {
  activeHive: string;
  setActiveHive: (value: string) => void;
}

const activeHiveContext = createContext<ActiveHiveContextType | undefined>(undefined);

export function AppWrapper({ children }: { children: ReactNode }) {
  const [activeHive, setActiveHive] = useState('Allround Hive');

  return <activeHiveContext.Provider value={{ activeHive, setActiveHive }}>{children}</activeHiveContext.Provider>;
}

export function useAppContext() {
  const context = useContext(activeHiveContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppWrapper');
  }

  return context;
}
