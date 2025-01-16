// tests/unit/registerSteps/username.step.spec.tsx
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import UsernameStep from '../../../src/components/registerSteps/UsernameStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from "../../../src/contexts/ErrorContext";
import { selectUsername } from '../../../src/api/register';

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
  selectUsername: jest.fn().mockResolvedValue({}),
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
      setUsername: jest.fn(),
      setInterests: jest.fn(),
      setRelationshipPreferenceId: jest.fn(),
      getPhoto: jest.fn(),
      getAdditionalPhotos: jest.fn().mockReturnValue(["https://example.com/photo1.png", "https://example.com/photo2.png"]),
      getGender: jest.fn()
  }
}));

const mockSelectUsername = selectUsername as jest.Mock;

describe('UsernameStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    mockShowError.mockClear();
    render(
        <ErrorProvider>
          <UsernameStep isu={123456} onNext={mockOnNext} />
        </ErrorProvider>
    );
  });

  it('renders the component', () => {
    expect(screen.getByText(/Введите логин/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Логин/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /продолжить/i })).toBeInTheDocument();
  });

  it('calls onNext with the correct username when Next is clicked', async () => {
    fireEvent.change(screen.getByLabelText(/Логин/i), { target: { value: 'testuser' } });
    const nextBtn = screen.getByRole('button', { name: /Продолжить/i });

    await act(async () => {
      fireEvent.click(nextBtn);
    });

    expect(mockOnNext).toHaveBeenCalledWith({ username: 'testuser' });
  });

  it('shows error if selectUsername fails', async () => {
    mockSelectUsername.mockRejectedValueOnce(new Error('Server error'));
    fireEvent.change(screen.getByLabelText(/Логин/i), { target: { value: 'testuser' } });
    const nextBtn = screen.getByRole('button', { name: /продолжить/i });

    await act(async () => {
      fireEvent.click(nextBtn);
    });
    expect(mockShowError).toHaveBeenCalledWith('Server error');
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('button is disabled when username is empty', () => {
    const nextButton = screen.getByRole('button', { name: /продолжить/i });
    fireEvent.click(nextButton); // Нажимаем кнопку "Next" без выбора

    expect(nextButton).toBeDisabled();
    expect(mockOnNext).not.toHaveBeenCalled(); // Проверяем, что функция не была вызвана
  });

  it('button is enabled when username is provided', () => {
    // Вводим имя пользователя
    const usernameInput = screen.getByLabelText(/Логин/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const nextButton = screen.getByRole('button', { name: /продолжить/i });
    expect(nextButton).toBeEnabled();// Проверяем, что кнопка "Next" включена
  });
});