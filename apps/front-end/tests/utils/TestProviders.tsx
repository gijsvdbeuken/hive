// tests/utils/TestProviders.tsx
import { ActiveChatProvider } from '@/app/context/activeChatContext';

export function TestProviders({ children }: { children: React.ReactNode }) {
  return <ActiveChatProvider>{children}</ActiveChatProvider>;
}
