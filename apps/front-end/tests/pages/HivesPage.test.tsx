import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HivesPage from '../../src/app/hives/page';
import React from 'react';

jest.mock('../../src/app/components/SessionProvider', () => ({
  useSession: () => ({
    user: {
      sub: 'user123',
      email: 'test@example.com',
    },
  }),
}));

const mockSetActiveHive = jest.fn();
jest.mock('../../src/app/context/activeHiveContext', () => ({
  useAppContext: () => ({
    activeHive: 'Allround Hive',
    setActiveHive: mockSetActiveHive,
  }),
}));

jest.mock('../../src/app/hives/components/HiveBlock', () => {
  return function MockHiveBlock({ onClick, selected, name, description }: any) {
    return (
      <div data-testid={`hive-block-${name}`} onClick={onClick} className={selected ? 'selected' : ''}>
        <span>{name}</span>
        <span>{description}</span>
      </div>
    );
  };
});

const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console methods
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
beforeEach(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

describe('HivesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        hives: [
          {
            id: 'test-hive',
            title: 'Test Hive',
            models: ['GPT-4', 'Claude 3.5 Sonnet'],
          },
        ],
      }),
    } as unknown as Response);
  });

  it('renders all main sections when authenticated', async () => {
    render(<HivesPage />);

    await waitFor(() => {
      expect(screen.getByText('Getting Started with Hive')).toBeInTheDocument();
      expect(screen.getByText('Create Custom Model')).toBeInTheDocument();
      expect(screen.getAllByText('Your Models')[0]).toBeInTheDocument();
      expect(screen.getByText('Pre-made Models')).toBeInTheDocument();
    });
  });

  it('fetches and displays user hives on load', async () => {
    render(<HivesPage />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_GATEWAY}/api/hives/user123`);
      expect(screen.getByText('Test Hive')).toBeInTheDocument();
    });
  });

  it('handles fetch error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<HivesPage />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to load user hives:', expect.any(Error));
    });
  });

  it('toggles LLM selection correctly', async () => {
    render(<HivesPage />);

    await waitFor(() => screen.getByText('Create Custom Model'));

    const gpt4Checkbox = screen.getByLabelText('GPT-4');
    const claudeCheckbox = screen.getByLabelText('Claude 3.5 Sonnet');

    fireEvent.click(gpt4Checkbox);
    fireEvent.click(claudeCheckbox);

    expect(gpt4Checkbox).toBeChecked();
    expect(claudeCheckbox).toBeChecked();

    fireEvent.click(gpt4Checkbox);
    expect(gpt4Checkbox).not.toBeChecked();
  });

  it('prevents creation with insufficient title or models', async () => {
    render(<HivesPage />);

    await waitFor(() => screen.getByText('Create Custom Model'));

    const createButton = screen.getByText('Create');

    fireEvent.click(createButton);
    expect(console.warn).toHaveBeenCalledWith('Please enter a title and select at least 2 language models.');

    const titleInput = screen.getByPlaceholderText('Model collection name');
    fireEvent.change(titleInput, { target: { value: 'Test Model' } });
    fireEvent.click(screen.getByLabelText('GPT-4'));
    fireEvent.click(createButton);

    expect(console.warn).toHaveBeenCalledWith('Please enter a title and select at least 2 language models.');
  });

  it('prevents creation of duplicate model titles', async () => {
    render(<HivesPage />);

    await waitFor(() => screen.getByText('Test Hive'));

    const titleInput = screen.getByPlaceholderText('Model collection name');
    fireEvent.change(titleInput, { target: { value: 'Test Hive' } });

    fireEvent.click(screen.getByLabelText('GPT-4'));
    fireEvent.click(screen.getByLabelText('Claude 3.5 Sonnet'));

    fireEvent.click(screen.getByText('Create'));

    expect(console.warn).toHaveBeenCalledWith('A model with this title already exists.');
  });

  it('successfully creates a new hive', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ hives: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

    render(<HivesPage />);

    await waitFor(() => screen.getByText('Create Custom Model'));

    const titleInput = screen.getByPlaceholderText('Model collection name');
    fireEvent.change(titleInput, { target: { value: 'New Hive' } });

    fireEvent.click(screen.getByLabelText('GPT-4'));
    fireEvent.click(screen.getByLabelText('Claude 3.5 Sonnet'));

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_GATEWAY}/api/hives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: 'user123',
          hiveId: 'new-hive',
          largeLanguageModels: ['GPT-4', 'Claude 3.5 Sonnet'],
        }),
      });
      expect(mockSetActiveHive).toHaveBeenCalledWith('New Hive');
    });
  });

  it('handles creation failure', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ hives: [] }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Creation failed' }),
      });

    render(<HivesPage />);

    await waitFor(() => screen.getByText('Create Custom Model'));

    const titleInput = screen.getByPlaceholderText('Model collection name');
    fireEvent.change(titleInput, { target: { value: 'New Hive' } });

    fireEvent.click(screen.getByLabelText('GPT-4'));
    fireEvent.click(screen.getByLabelText('Claude 3.5 Sonnet'));

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Backend error:', { error: 'Creation failed' });
    });
  });

  it('deletes a hive successfully', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          hives: [
            {
              id: 'test-hive',
              title: 'Test Hive',
              models: ['GPT-4', 'Claude 3.5 Sonnet'],
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

    render(<HivesPage />);

    await waitFor(() => screen.getByText('Test Hive'));

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_GATEWAY}/api/hives/user123/test-hive`, { method: 'DELETE' });
    });
  });

  it('handles delete failure', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          hives: [
            {
              id: 'test-hive',
              title: 'Test Hive',
              models: ['GPT-4', 'Claude 3.5 Sonnet'],
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      });

    render(<HivesPage />);

    await waitFor(() => screen.getByText('Test Hive'));

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error deleting hive:', expect.any(Error));
    });
  });

  it('sets active hive when clicking on user model', async () => {
    render(<HivesPage />);

    await waitFor(() => screen.getByText('Test Hive'));

    const hiveCard = screen.getByText('Test Hive').closest('div');
    fireEvent.click(hiveCard!);

    expect(mockSetActiveHive).toHaveBeenCalledWith('Test Hive');
  });

  it('sets active hive when clicking pre-made models', async () => {
    render(<HivesPage />);

    await waitFor(() => screen.getByTestId('hive-block-Allround Hive'));

    const allroundHive = screen.getByTestId('hive-block-Allround Hive');
    fireEvent.click(allroundHive);

    expect(mockSetActiveHive).toHaveBeenCalledWith('Allround Hive');
  });

  it('shows "No custom models yet" when user has no models', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ hives: [] }),
    } as unknown as Response);

    render(<HivesPage />);

    await waitFor(() => {
      expect(screen.getByText('No custom models yet.')).toBeInTheDocument();
    });
  });

  it('displays active hive with ring styling', async () => {
    render(<HivesPage />);

    await waitFor(() => screen.getByText('Test Hive'));

    const hiveCard = screen.getByText('Test Hive').closest('div');
    expect(hiveCard).not.toHaveClass('ring-2', 'ring-white/25');
  });

  it('prevents event propagation when clicking delete button', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          hives: [
            {
              id: 'test-hive',
              title: 'Test Hive',
              models: ['GPT-4', 'Claude 3.5 Sonnet'],
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

    render(<HivesPage />);

    await waitFor(() => screen.getByText('Test Hive'));

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockSetActiveHive).not.toHaveBeenCalledWith('Test Hive');
  });
});
