// tests/unit/registerSteps/gender.step.spec.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import GenderStep from '../../../src/components/registerSteps/GenderStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from "../../../src/contexts/ErrorContext";
import { selectPreferences } from '../../../src/api/register';

// 1) Mock useError + selectPreferences:

export const mockShowError = jest.fn();

// This re-mock must appear BEFORE the component is imported
jest.mock('../../../src/contexts/ErrorContext', () => {
  const actual = jest.requireActual('../../../src/contexts/ErrorContext');
  return {
    __esModule: true,
    ...actual,
    useError: () => ({
      showError: mockShowError
    }),
  };
});
jest.mock('../../../src/api/register', () => ({
  __esModule: true,
  selectPreferences: jest.fn().mockResolvedValue({}),
}));

describe('GenderStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    mockShowError.mockClear();
    render(
        <ErrorProvider>
          <GenderStep isu={123456} onNext={mockOnNext} />
        </ErrorProvider>
    );
  });

  it('renders the component', () => {
    expect(screen.getByText(/Показывать мне/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /продолжить/i })).toBeInTheDocument();
  });

  it('button is disabled when no gender is selected', () => {
    const nextButton = screen.getByRole('button', { name: /продолжить/i });
    expect(nextButton).toBeDisabled();
  });

  it('button is enabled when a gender is selected', async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /женщины/i }));
    });
    const nextButton = screen.getByRole('button', { name: /продолжить/i });
    expect(nextButton).toBeEnabled();
  });
});