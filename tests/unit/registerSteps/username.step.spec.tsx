import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UsernameStep from '../../../src/components/registerSteps/UsernameStep';
import '@testing-library/jest-dom';

describe('UsernameStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear(); // Сбрасываем мок перед каждым тестом
    render(<UsernameStep onNext={mockOnNext} />)
  });

  it('renders the component', () => {
    expect(screen.getByText(/Enter your username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls onNext with the correct username when Next is clicked', () => {
    // Вводим имя пользователя
    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    // Нажимаем кнопку "Next"
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockOnNext).toHaveBeenCalledWith({ username: 'testuser' });
    expect(mockOnNext).toHaveBeenCalledTimes(1);
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