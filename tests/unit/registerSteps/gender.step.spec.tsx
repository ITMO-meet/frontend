// tests/unit/registerSteps/gender.step.spec.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import GenderStep from '../../../src/components/registerSteps/GenderStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from "../../../src/contexts/ErrorContext";

// Inline mock
jest.mock('../../../src/api/register', () => ({
  __esModule: true,
  selectPreferences: jest.fn().mockResolvedValue({}), // resolves successfully
}));

describe('GenderStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    render(
        <ErrorProvider>
          <GenderStep isu={123456} onNext={mockOnNext} />
        </ErrorProvider>
    );
  });

  it('renders the component', () => {
    expect(screen.getByText(/Show me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });


  it('button is disabled when no gender is selected', () => {
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('button is enabled when a gender is selected', async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /female/i }));
    });
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeEnabled();
  });
});
