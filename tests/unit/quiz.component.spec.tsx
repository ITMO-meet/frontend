import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Quiz } from '../../src/components/pages/Quiz';
import { MemoryRouter, useParams } from 'react-router-dom';
import * as api from '../../src/api/tests';

const mockTest2 = {
  name: "test2",
  description: "test2 desc",
  questions_count: 2
}

const mockTestResult = {
  result_id: "123"
}

const mockQuestion1 = {
  description: "Question 1?",
  question_number: 0
}

const mockQuestion2 = {
  description: "Question 2?",
  question_number: 0
}

const mockGetQuestions = (test_id: string, question_number: number) => {
  if (question_number === 0) {
    return mockQuestion1;
  }
  return mockQuestion2;
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue("test_id"),
}));

jest.mock('../../src/api/tests', () => ({
  getTest: jest.fn(),
  startTest: jest.fn(),
  getQuestion: jest.fn(),
  answerQuestion: jest.fn(),
  completeTest: jest.fn(),
}));

describe('Quiz component', () => {
  const mockOnExit = jest.fn();
  let container: HTMLElement;

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (api.getTest as jest.Mock).mockResolvedValue(mockTest2);
    (api.startTest as jest.Mock).mockResolvedValue(mockTestResult);
    (api.getQuestion as jest.Mock).mockImplementation(mockGetQuestions); 
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('fetches test details and starts the test on mount', async () => {
    render(<MemoryRouter><Quiz onExit={mockOnExit} /></MemoryRouter>);

    await waitFor(() => {
      expect(api.getTest).toHaveBeenCalledWith('1');
      expect(api.startTest).toHaveBeenCalledWith('1', expect.anything());
    });
  });

  it('renders the first question', async () => {
    render(<MemoryRouter><Quiz onExit={mockOnExit} /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('Question 1?')).toBeInTheDocument();
    });
  });

  it('handles answering a question and proceeds to the next question', async () => {
    ({ container } = render(<MemoryRouter><Quiz onExit={mockOnExit} /></MemoryRouter>));

    const firstOpt = container.getElementsByClassName("option-choice")[0]
    const button = screen.getByRole('button', { name: /Continue/i });

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for 0 seconds (so the useEffects complete)

    expect(button).toBeDisabled();
    fireEvent.click(firstOpt);
    expect(button).toBeEnabled()
    fireEvent.click(button);
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(api.answerQuestion).toHaveBeenCalledWith("123", 0, expect.anything());
      expect(api.getQuestion).toHaveBeenCalledWith('1', 1); // Fetch the second question
    });

    await waitFor(() => {
      expect(screen.getByText('Question 2?')).toBeInTheDocument();
    });
  });
  
  it('calls onExit when exit button is clicked', async () => {
    render(<MemoryRouter><Quiz onExit={mockOnExit} /></MemoryRouter>);

    const exitButton = screen.getByTestId("CloseIcon");
    fireEvent.click(exitButton);

    expect(mockOnExit).toHaveBeenCalledTimes(1);
  });

  it('button disabled until choosen and disabled after click', () => {
    ({ container } = render(<MemoryRouter><Quiz onExit={mockOnExit} /></MemoryRouter>));

    const firstOpt = container.getElementsByClassName("option-choice")[0]
    const button = screen.getByRole('button', { name: /Continue/i });

    expect(button).toBeDisabled();
    fireEvent.click(firstOpt);
    expect(button).toBeEnabled()
    fireEvent.click(button);
    expect(button).toBeDisabled();
  });
});