'use client';
import { createContext, useContext, ReactNode } from 'react';

interface CustomSession {
  user?: {
    sub?: string;
    email?: string;
  };
}

interface SessionContextType {
  session: CustomSession;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ session, children }: { session: CustomSession; children: ReactNode }) {
  return <SessionContext.Provider value={{ session }}>{children}</SessionContext.Provider>;
}

export function useSession(): CustomSession {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context.session;
}
