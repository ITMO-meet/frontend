import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GenderStep from '../../../src/components/registerSteps/GenderStep';
import '@testing-library/jest-dom';

describe('GenderStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear(); // Сбрасываем мок перед каждым тестом
    render(<GenderStep onNext={mockOnNext} />);
  });

  it('renders the component', () => {
    expect(screen.getByText(/Dating Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Show me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls onNext with the correct gender when Next is clicked', () => {
    // Симулируем выбор пола
    fireEvent.click(screen.getByRole('button', { name: /female/i }));
    
    // Нажимаем кнопку "Next"
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockOnNext).toHaveBeenCalledWith({ gender: 'Female' });
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('button is disabled when no gender is selected', () => {
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled(); // Проверяем, что кнопка "Next" отключена
  });

  it('button is enabled when a gender is selected', () => {
    // Симулируем выбор пола
    fireEvent.click(screen.getByRole('button', { name: /female/i }));

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeEnabled(); // Проверяем, что кнопка "Next" включена
  });
});