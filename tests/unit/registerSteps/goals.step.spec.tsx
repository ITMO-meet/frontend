// tests/unit/registerSteps/goal.step.spec.tsx
import '@testing-library/jest-dom';
import { fireEvent, render, screen, act } from '@testing-library/react';
import React from 'react';
import GoalStep from '../../../src/components/registerSteps/GoalStep';
// import theme from '../../../src/components/theme';
import { ErrorProvider } from "../../../src/contexts/ErrorContext";
import { fetchPreferences, selectRelationship } from '../../../src/api/register';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  fetchPreferences: jest.fn().mockResolvedValue([
    { id: '672b44eab151637e969889bc', text: 'Friendship', icon: 'relationship_preferences' },
    { id: '672b44eab151637e969889bd', text: 'Dating', icon: 'relationship_preferences' },
  ]),
  selectRelationship: jest.fn().mockResolvedValue({}),
}));
jest.mock('../../../src/stores/UserDataStore', () => ({
  userData: {
      loading: false,
      getIsu: jest.fn().mockReturnValue(1),
      getUsername: jest.fn().mockReturnValue("Alisa Pipisa"),
      getBio: jest.fn().mockReturnValue("Test Bio"),
      getBirthdate: jest.fn().mockReturnValue("2000-01-01"),
      getAge: jest.fn().mockReturnValue(20),
      getWeight: jest.fn().mockReturnValue(70),
      getHeight: jest.fn().mockReturnValue(100),
      getZodiac: jest.fn().mockReturnValue("Capricorn"),
      getGenderPreference: jest.fn().mockReturnValue("Everyone"),
      getRelationshipPreferenceId: jest.fn().mockReturnValue("672b44eab151637e969889bd"),
      getWorldview: jest.fn().mockReturnValue("World"),
      getChildren: jest.fn().mockReturnValue("Children"),
      getLanguages: jest.fn().mockReturnValue(["Russian"]),
      getAlcohol: jest.fn().mockReturnValue("Ok"),
      getSmoking: jest.fn().mockReturnValue("Ok"),
      getInterests: jest.fn().mockReturnValue(["Reading", "Traveling", "Cooking"]),
      getInterestIDs: jest.fn().mockReturnValue([""]),
      // Добавьте другие методы по мере необходимости
      setInterests: jest.fn(),
      setRelationshipPreferenceId: jest.fn(),
      getPhoto: jest.fn(),
      getAdditionalPhotos: jest.fn().mockReturnValue(["https://example.com/photo1.png", "https://example.com/photo2.png"]),
      getGender: jest.fn()
  }
}));

const mockFetchPreferences = fetchPreferences as jest.Mock;
const mockSelectRelationship = selectRelationship as jest.Mock;

describe('GoalStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(async () => {
    mockOnNext.mockClear();
    mockShowError.mockClear();
    await act(async () => {
      render(
          <ErrorProvider>
            <GoalStep isu={123456} onNext={mockOnNext} />
          </ErrorProvider>
      );
    });
  });

  it('renders the component', () => {
    expect(screen.getByText(/Что вы ищите?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /продолжить/i })).toBeInTheDocument();
  });

  it('loads goals from fetchPreferences', () => {
    // "friendship" is from the mock fetch
    expect(screen.getByText(/friendship/i)).toBeInTheDocument();
  });

  // it('allows selecting a goal', () => {
  //   const firstPaper = screen.getByTestId('goal-672b44eab151637e969889bc');
  //   fireEvent.click(firstPaper);
  //   expect(firstPaper).toHaveStyle(`background: ${theme.palette.secondary.light}`);
  // });

  it('does not call onNext if no goal is selected', () => {
    const nextButton = screen.getByRole('button', { name: /продолжить/i });
    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('enables the Next button when goal is selected', () => {
    const nextButton = screen.getByRole('button', { name: /продолжить/i });
    expect(nextButton).toBeDisabled();
    fireEvent.click(screen.getByText(/friendship/i).closest('div')!);
    expect(nextButton).toBeEnabled();
  });



  it('shows error if selectRelationship fails', async () => {
    mockSelectRelationship.mockRejectedValueOnce(new Error('Relationship error'));
    fireEvent.click(screen.getByText(/friendship/i).closest('div')!);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /продолжить/i }));
    });
    expect(mockShowError).toHaveBeenCalledWith('Relationship error');
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('shows error if fetchPreferences fails', async () => {
    mockFetchPreferences.mockRejectedValueOnce(new Error('Prefs error'));
    mockOnNext.mockClear();
    mockShowError.mockClear();

    await act(async () => {
      render(
          <ErrorProvider>
            <GoalStep isu={123456} onNext={mockOnNext} />
          </ErrorProvider>
      );
    });
    expect(mockShowError).toHaveBeenCalledWith('Prefs error');
  });
});