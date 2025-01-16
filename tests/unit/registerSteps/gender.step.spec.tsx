// tests/unit/registerSteps/gender.step.spec.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import GenderStep from '../../../src/components/registerSteps/GenderStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from "../../../src/contexts/ErrorContext";

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
      getRelationshipPreferenceId: jest.fn().mockReturnValue("672b44eab151637e969889bc"),
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