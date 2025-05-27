// app/page.tsx or app/home/page.tsx
import { auth0 } from '@/lib/auth0';
import HomePage from './components/home/Home';

export default async function Home() {
  const session = await auth0.getSession();

  return <HomePage session={session} />;
}
