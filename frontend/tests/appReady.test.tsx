import { render, screen, waitFor } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import { describe, it, expect, vi } from 'vitest';

// Simulate the logic of the app readiness loop
const AppReadyComponent = ({
  isReady,
}: {
  isReady: () => Promise<boolean>;
}) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 5;

    const checkReady = async () => {
      while (attempts < maxAttempts) {
        const result = await isReady();
        if (result) {
          setReady(true);
          return;
        }
        await new Promise((r) => setTimeout(r, 1));
        attempts++;
      }
      setError('Backend failed to initialize within timeout');
    };

    void checkReady();
  }, [isReady]);

  if (error) return <div>Error: {error}</div>;
  if (!ready) return <div>Not ready</div>;
  return <div>Ready</div>;
};

describe('App readiness fallback UI', () => {
  it('shows fallback and then success when backend becomes ready', async () => {
    let calls = 0;
    const isReady = vi.fn().mockImplementation(() => {
      calls++;
      return Promise.resolve(calls >= 3);
    });

    render(<AppReadyComponent isReady={isReady} />);
    expect(screen.getByText('Not ready')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Ready')).toBeTruthy();
    });
  });

  it('shows error if backend never becomes ready', async () => {
    const isReady = vi.fn().mockResolvedValue(false);

    render(<AppReadyComponent isReady={isReady} />);

    await waitFor(() => {
      expect(screen.getByText(/Error/)).toBeTruthy();
    });
  });
});
