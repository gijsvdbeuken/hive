'use client';
import { createContext, useState, useContext } from 'react';

const activeHiveContext = createContext<any>(undefined);

export function AppWrapper({ children }: { children: React.ReactNode }) {
  let [activeHive, setActiveHive] = useState('allround-hive');

  return <activeHiveContext.Provider value={{ activeHive, setActiveHive }}>{children}</activeHiveContext.Provider>;
}

export function useAppContext() {
  return useContext(activeHiveContext);
}
