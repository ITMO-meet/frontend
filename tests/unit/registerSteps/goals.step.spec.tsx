// tests/unit/registerSteps/goals.step.spec.tsx
import '@testing-library/jest-dom';
import { fireEvent, render, screen, act } from '@testing-library/react';
import React from 'react';
import GoalStep from '../../../src/components/registerSteps/GoalStep';
import theme from '../../../src/components/theme';
import { ErrorProvider } from "../../../src/contexts/ErrorContext";

// Inline mock
jest.mock('../../../src/api/register', () => ({
  __esModule: true,
  fetchPreferences: jest.fn().mockResolvedValue(['friendship']),
  selectRelationship: jest.fn().mockResolvedValue({}),
}));

describe('GoalStep', () => {
  const mockOnNext = jest.fn();
  let container: HTMLElement;

  beforeEach(async () => {
    mockOnNext.mockClear();
    await act(async () => {
      ({ container } = render(
          <ErrorProvider>
            <GoalStep isu={123456} onNext={mockOnNext} />
          </ErrorProvider>
      ));
    });
  });

  it('renders the component', () => {
    expect(screen.getByText(/What are you looking for?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('allows selecting a goal', () => {
    // The first Paper is "friendship" because fetchPreferences => ['friendship','dating']
    const goalCard = container.getElementsByClassName("MuiPaper-root")[0];
    fireEvent.click(goalCard);
    expect(goalCard).toBeInTheDocument();
    expect(goalCard).toHaveStyle(`background: ${theme.palette.secondary.light}`);
  });


  it('does not call onNext if no goal is selected', () => {
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('enables the Next button when goal is selected', () => {
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
    // Click the Paper with text "friendship"
    fireEvent.click(screen.getByText(/friendship/i).closest('div')!);
    expect(nextButton).toBeEnabled();
  });
});
