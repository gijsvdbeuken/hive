import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SettingsPage from '../../src/app/settings/page';
import React from 'react';

jest.mock('../../src/app/components/SessionProvider', () => ({
  useSession: () => ({
    user: {
      sub: 'user123',
      email: 'test@example.com',
    },
  }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
      auth0_id: 'user123',
      email: 'test@example.com',
      created_at: '2023-01-01',
      username: 'johndoe',
      role: 'user',
      plan: 'free',
      language: 'en',
      theme: 'light',
      email_notifications: true,
      beta_features_opt_in: true,
    }),
  } as unknown as Response);
});

describe('SettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    render(<SettingsPage />);
    expect(screen.getByText('Loading settings...')).toBeInTheDocument();
    await waitFor(() => screen.getByText('Settings'));
  });

  it('handles update failure on form submit', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          auth0_id: 'user123',
          email: 'test@example.com',
          created_at: '2023-01-01',
          username: 'johndoe',
          role: 'user',
          plan: 'free',
          language: 'en',
          theme: 'light',
          email_notifications: true,
          beta_features_opt_in: true,
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Update failed' }),
      });

    render(<SettingsPage />);
    await waitFor(() => screen.getByDisplayValue('johndoe'));
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => expect(screen.getByText('Update failed')).toBeInTheDocument());
  });

  it('handles delete confirmation cancel', async () => {
    window.confirm = jest.fn().mockReturnValue(false);
    render(<SettingsPage />);
    await waitFor(() => screen.getByDisplayValue('johndoe'));
    fireEvent.click(screen.getByText('Delete My Account'));
    expect(mockFetch).toHaveBeenCalledTimes(1); // Only the initial fetch
  });
});
