import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BioStep from '../../../src/components/registerSteps/BioStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from '../../../src/contexts/ErrorContext';

const mockShowError = jest.fn();

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

describe('BioStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear(); // Сбрасываем мок перед каждым тестом
    mockShowError.mockClear();
    render(
      <ErrorProvider>
        <BioStep onNext={mockOnNext} />
      </ErrorProvider>
    );
  });

  it('renders the component', () => {
    expect(screen.getByText(/Enter information about yourself/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Edit your bio.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls onNext with the correct bio when Next is clicked', () => {
    // Вводим описание
    const bioInput = screen.getByPlaceholderText(/Edit your bio.../i);
    fireEvent.change(bioInput, { target: { value: 'This is my bio.' } });

    // Нажимаем кнопку "Next"
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockOnNext).toHaveBeenCalledWith({ bio: 'This is my bio.' });
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('button is disabled when bio is empty', () => {
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton); // Нажимаем кнопку "Next" без ввода

    expect(nextButton).toBeDisabled();
    expect(mockOnNext).not.toHaveBeenCalled(); // Проверяем, что функция не была вызвана
  });

  it('button is enabled when bio is provided', () => {
    // Вводим описание
    const bioInput = screen.getByPlaceholderText(/Edit your bio.../i);
    fireEvent.change(bioInput, { target: { value: 'This is my bio.' } });

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeEnabled(); // Проверяем, что кнопка "Next" включена
  });
});
