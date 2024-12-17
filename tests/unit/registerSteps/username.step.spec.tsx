// tests/unit/registerSteps/username.step.spec.tsx
import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import UsernameStep from '../../../src/components/registerSteps/UsernameStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from "../../../src/contexts/ErrorContext";

jest.mock('../../../src/api/register', () => ({
  __esModule: true,
  selectUsername: jest.fn().mockResolvedValue({}),
}));

describe('UsernameStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    render(
        <ErrorProvider>
          <UsernameStep isu={123456} onNext={mockOnNext} />
        </ErrorProvider>
    );
  });

  it('renders the component', () => {
    expect(screen.getByText(/Choose a username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls onNext with the correct username when Next is clicked', async () => {
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).toBeEnabled();

    await act(async () => {
      fireEvent.click(nextBtn);
    });
    expect(mockOnNext).toHaveBeenCalledWith({ username: 'testuser' });
  });


  it('button is disabled when username is empty', () => {
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton); // Нажимаем кнопку "Next" без выбора

    expect(nextButton).toBeDisabled();
    expect(mockOnNext).not.toHaveBeenCalled(); // Проверяем, что функция не была вызвана
  });

  it('button is enabled when username is provided', () => {
    // Вводим имя пользователя
    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeEnabled(); // Проверяем, что кнопка "Next" включена
  });
});