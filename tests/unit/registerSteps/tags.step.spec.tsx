// tests/unit/registerSteps/tags.step.spec.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TagsStep from '../../../src/components/registerSteps/TagsStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from '../../../src/contexts/ErrorContext';
import { fetchTags, selectTags } from '../../../src/api/register';
import { useError as originalUseError } from '../../../src/contexts/ErrorContext';

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
  fetchTags: jest.fn().mockResolvedValue(['music', 'gym']),
  selectTags: jest.fn().mockResolvedValue({}),
}));

const mockFetchTags = fetchTags as jest.Mock;
const mockSelectTags = selectTags as jest.Mock;

describe('TagsStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(async () => {
    mockOnNext.mockClear();
    mockShowError.mockClear();
    await act(async () => {
      render(
          <ErrorProvider>
            <TagsStep isu={123456} onNext={mockOnNext} />
          </ErrorProvider>
      );
    });
  });

  it('renders the component and fetches tags', () => {
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    // The tags “music” & “gym” were fetched & rendered
    expect(screen.getByText(/music/i)).toBeInTheDocument();
    expect(screen.getByText(/gym/i)).toBeInTheDocument();
  });





  it('shows error if selectTags fails', async () => {
    mockSelectTags.mockRejectedValueOnce(new Error('Tags server error'));
    fireEvent.click(screen.getByText(/music/i));
    fireEvent.click(screen.getByText(/gym/i));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    expect(mockShowError).toHaveBeenCalledWith('Tags server error');
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('shows error if fetchTags fails', async () => {
    mockFetchTags.mockRejectedValueOnce(new Error('Fetch tags error'));
    mockOnNext.mockClear();
    mockShowError.mockClear();

    await act(async () => {
      render(
          <ErrorProvider>
            <TagsStep isu={123456} onNext={mockOnNext} />
          </ErrorProvider>
      );
    });
    expect(mockShowError).toHaveBeenCalledWith('Fetch tags error');
  });
});