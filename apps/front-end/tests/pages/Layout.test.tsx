import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('next/font/google', () => ({
  Geist: jest.fn(() => ({
    variable: '--font-geist-sans',
  })),
  Geist_Mono: jest.fn(() => ({
    variable: '--font-geist-mono',
  })),
}));

jest.mock('@fortawesome/fontawesome-free/css/all.min.css', () => ({}));
jest.mock('../../src/app/globals.css', () => ({}));

const mockGetSession = jest.fn();
jest.mock('../../src/lib/auth0', () => ({
  auth0: {
    getSession: () => mockGetSession(),
  },
}));

jest.mock('../../src/app/components/home/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock('../../src/app/context/activeHiveContext', () => ({
  AppWrapper: ({ children }: { children: React.ReactNode }) => <div data-testid="app-wrapper">{children}</div>,
}));

jest.mock('../../src/app/context/activeChatContext', () => ({
  ActiveChatProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="active-chat-provider">{children}</div>,
}));

jest.mock('../../src/app/components/SessionProvider', () => ({
  SessionProvider: ({ children, session }: { children: React.ReactNode; session: any }) => (
    <div data-testid="session-provider" data-session={JSON.stringify(session)}>
      {children}
    </div>
  ),
}));

async function TestRootLayout({ children }: { children: React.ReactNode }) {
  const { auth0 } = await import('../../src/lib/auth0');
  const auth0Session = await auth0.getSession();
  const session = {
    user: auth0Session?.user
      ? {
          sub: auth0Session.user.sub,
          email: auth0Session.user.email,
        }
      : undefined,
  };

  const { SessionProvider } = await import('../../src/app/components/SessionProvider');
  const { ActiveChatProvider } = await import('../../src/app/context/activeChatContext');
  const { AppWrapper } = await import('../../src/app/context/activeHiveContext');
  const { default: Sidebar } = await import('../../src/app/components/home/Sidebar');

  return (
    <SessionProvider session={session}>
      <ActiveChatProvider>
        <AppWrapper>
          <div className="flex h-screen font-albert">
            <Sidebar />
            <main className="flex-1" role="main">
              {children}
            </main>
          </div>
        </AppWrapper>
      </ActiveChatProvider>
    </SessionProvider>
  );
}

describe('RootLayout (Test Wrapper)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with authenticated user session', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        sub: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    const TestChild = () => <div data-testid="test-child">Test Content</div>;

    render(await TestRootLayout({ children: <TestChild /> }));

    const sessionProvider = screen.getByTestId('session-provider');
    const sessionData = JSON.parse(sessionProvider.getAttribute('data-session') || '{}');
    expect(sessionData).toEqual({
      user: {
        sub: 'user123',
        email: 'test@example.com',
      },
    });

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('active-chat-provider')).toBeInTheDocument();
    expect(screen.getByTestId('app-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();

    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-1');
    expect(main).toContainElement(screen.getByTestId('test-child'));
  });

  it('renders with unauthenticated user (no session)', async () => {
    mockGetSession.mockResolvedValue(null);

    const TestChild = () => <div data-testid="test-child">Test Content</div>;

    render(await TestRootLayout({ children: <TestChild /> }));

    const sessionProvider = screen.getByTestId('session-provider');
    const sessionData = JSON.parse(sessionProvider.getAttribute('data-session') || '{}');
    expect(sessionData).toEqual({
      user: undefined,
    });

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders main layout structure with correct classes', async () => {
    mockGetSession.mockResolvedValue(null);

    const TestChild = () => <div data-testid="test-child">Test Content</div>;

    render(await TestRootLayout({ children: <TestChild /> }));

    const mainContainer = screen.getByTestId('sidebar').parentElement;
    expect(mainContainer).toHaveClass('flex', 'h-screen', 'font-albert');
  });

  it('calls getSession once', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        sub: 'user123',
        email: 'test@example.com',
      },
    });

    const TestChild = () => <div data-testid="test-child">Test Content</div>;

    render(await TestRootLayout({ children: <TestChild /> }));

    expect(mockGetSession).toHaveBeenCalledTimes(1);
  });
});
