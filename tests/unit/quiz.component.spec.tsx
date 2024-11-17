import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Quiz } from '../../src/components/pages/Quiz';
import { MemoryRouter, useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const mockGetQuestions = (id: number) => {
  if (id === 1) {
    return [
      {
        id: 1,
        text: 'Question 1?',
      },
    ]
  } else {
    return [
      {
        id: 1,
        text: 'Question 1?',
      },
      {
        id: 2,
        text: 'Question 2?',
      },
    ];
  }
}

describe('Quiz component', () => {
  const mockJestGetQuestions = jest.fn(mockGetQuestions);
  const mockOnFinish = jest.fn();
  const mockOnExit = jest.fn();
  let container: HTMLElement;

  beforeEach(() => {
    // mockJestGetQuestions = jest.fn(mockGetQuestions);
    // mockOnFinish = jest.fn();
    // mockOnExit = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers(); // Очищает все таймеры
  });

  it('calls getQuestions', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    ({ container } = render(<MemoryRouter><Quiz getQuestions={mockJestGetQuestions} onFinish={mockOnFinish} onExit={mockOnExit} /></MemoryRouter>));

    expect(mockJestGetQuestions).toHaveBeenCalledTimes(1);
    expect(mockJestGetQuestions).toHaveBeenCalledWith(1)
  });

  it('renders the first question', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '2' });
    ({ container } = render(<MemoryRouter><Quiz getQuestions={mockJestGetQuestions} onFinish={mockOnFinish} onExit={mockOnExit} /></MemoryRouter>));

    expect(screen.getByText('Question 1?')).toBeInTheDocument();
  });

  it('button disabled until choosen and disabled after click', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '2' });
    ({ container } = render(<MemoryRouter><Quiz getQuestions={mockJestGetQuestions} onFinish={mockOnFinish} onExit={mockOnExit} /></MemoryRouter>));

    const firstOpt = container.getElementsByClassName("option-choice")[0]
    const button = screen.getByRole('button', { name: /Continue/i });

    expect(button).toBeDisabled();
    fireEvent.click(firstOpt);
    expect(button).toBeEnabled()
    fireEvent.click(button);
    expect(button).toBeDisabled();
  });

  it('calls onExit when exit button is clicked', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '2' });
    ({ container } = render(<MemoryRouter><Quiz getQuestions={mockJestGetQuestions} onFinish={mockOnFinish} onExit={mockOnExit} /></MemoryRouter>));

    const exitButton = container.getElementsByClassName("quiz-close")[0]
    fireEvent.click(exitButton);

    expect(mockOnExit).toHaveBeenCalledTimes(1);
  });

  it('calls onFinish when all questions are answered', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    ({ container } = render(<MemoryRouter><Quiz getQuestions={mockJestGetQuestions} onFinish={mockOnFinish} onExit={mockOnExit} /></MemoryRouter>));

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