import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Quiz } from '../../src/components/pages/Quiz';

describe('Quiz component', () => {
  let mockOnFinish: jest.Mock;
  let mockOnExit: jest.Mock;
  let container: HTMLElement;

  const questions1 = [
    {
      id: 1,
      text: 'Question 1?',
    },
    {
      id: 2,
      text: 'Question 2?',
    },
  ];

  const questions2 = [
    {
      id: 1,
      text: 'Question 1?',
    },
  ]

  beforeEach(() => {
    mockOnFinish = jest.fn();
    mockOnExit = jest.fn();
  });

  it('renders the first question', () => {
    ({ container } = render(<Quiz questions={questions1} onFinish={mockOnFinish} onExit={mockOnExit} />));

    expect(screen.getByText('Question 1?')).toBeInTheDocument();
  });

  it('button disabled until choosen and disabled after click', () => {
    ({ container } = render(<Quiz questions={questions1} onFinish={mockOnFinish} onExit={mockOnExit} />));

    const firstOpt = container.getElementsByClassName("option-choice")[0]
    const button = screen.getByRole('button', { name: /Continue/i });

    expect(button).toBeDisabled();
    fireEvent.click(firstOpt);
    expect(button).toBeEnabled()
    fireEvent.click(button);
    expect(button).toBeDisabled();
  });

  it('calls onExit when exit button is clicked', () => {
    ({ container } = render(<Quiz questions={questions1} onFinish={mockOnFinish} onExit={mockOnExit} />));

    const exitButton = container.getElementsByClassName("quiz-close")[0]
    fireEvent.click(exitButton);

    expect(mockOnExit).toHaveBeenCalledTimes(1);
  });

  it('calls onFinish when all questions are answered', async () => {
    ({ container } = render(<Quiz questions={questions2} onFinish={mockOnFinish} onExit={mockOnExit} />));

    const firstOpt = container.getElementsByClassName("option-choice")[0]
    const button = screen.getByRole('button', { name: /Continue/i });

    fireEvent.click(firstOpt);
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnFinish).toHaveBeenCalledWith([
        { id: 1, answerIndex: 0 },
      ]);
    });
  });
});