'use client';
import { createContext, useContext, ReactNode } from 'react';

interface SessionContextType {
  session: unknown;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ session, children }: { session: unknown; children: ReactNode }) {
  return <SessionContext.Provider value={{ session }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context.session;
}
