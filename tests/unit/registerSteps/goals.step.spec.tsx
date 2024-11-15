// GoalStep.test.tsx
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import GoalStep from '../../../src/components/registerSteps/GoalStep';
import theme from '../../../src/components/theme';

describe('GoalStep', () => {
  const mockOnNext = jest.fn();
  let container: HTMLElement;

  beforeEach(() => {
    mockOnNext.mockClear(); // Сбрасываем мок перед каждым тестом
    ({ container } = render(<GoalStep onNext={mockOnNext} />));
  });

  it('renders the component', () => {
    expect(screen.getByText(/What are you looking for?/i)).toBeInTheDocument();
    expect(screen.getByText(/It can be changed at any time/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('allows selecting a goal', () => {
    const goalCard = container.getElementsByClassName("MuiPaper-root")[0];
    fireEvent.click(goalCard); // Кликаем по карточке цели

    expect(goalCard).toBeInTheDocument();
    expect(goalCard).toHaveStyle(`background: ${theme.palette.secondary.light}`); // Проверяем, что цвет изменился
  });

  it('calls onNext with the selected goal when Next is clicked', () => {
    fireEvent.click(screen.getByText(/Знакомства/i).closest('div')!); // Выбираем цель
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Нажимаем кнопку "Next"

    expect(mockOnNext).toHaveBeenCalledWith({ goal: 'Знакомства' });
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('does not call onNext if no goal is selected', () => {
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton); // Нажимаем кнопку "Next" без выбора

    expect(nextButton).toBeDisabled();
    expect(mockOnNext).not.toHaveBeenCalled(); // Проверяем, что функция не была вызвана
  });

  it('enables the Next button when goal is selected', () => {
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled(); // Проверяем, что кнопка "Next" отключена

    fireEvent.click(screen.getByText(/Знакомства/i).closest('div')!); // Выбираем цель
    expect(nextButton).toBeEnabled(); // Проверяем, что кнопка "Next" включена
  });
});
