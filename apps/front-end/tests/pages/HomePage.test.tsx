import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../src/app/components/home/Home';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';
import React from 'react';
import { TestProviders } from '../utils/TestProviders';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: { answer: 'Mocked answer from API' } }),
  }),
) as jest.Mock;

const mockPush = jest.fn();

describe('Home component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('redirects to login if session is null', () => {
    render(
      <TestProviders>
        <Home session={null} />
      </TestProviders>,
    );
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });
});
