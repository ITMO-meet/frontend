import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MainFeaturesStep from '../../../src/components/registerSteps/MainFeaturesStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from '../../../src/contexts/ErrorContext';

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
  profileDetails: jest.fn().mockResolvedValue({}),
}));

describe('MainFeaturesStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear(); // Сбрасываем мок перед каждым тестом
    render(
      <ErrorProvider>
        <MainFeaturesStep isu={123456} bio={"Some bio"} onNext={mockOnNext} />
      </ErrorProvider>
    );
  });

  it('renders the component', () => {
    expect(screen.getByText(/Enter some main information/i)).toBeInTheDocument();
    expect(screen.getByText(/Height:/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight:/i)).toBeInTheDocument();
    expect(screen.getByText(/Zodiac Sign/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls onNext with the correct data when Next is clicked', async () => {
    // Изменяем вес
    const weightSlider = screen.getAllByRole("slider")[1];
    fireEvent.change(weightSlider, { target: { value: 80 } });

    // Изменяем рост
    const heightSlider = screen.getAllByRole("slider")[0];
    fireEvent.change(heightSlider, { target: { value: 180 } });

    // Изменяем знак зодиака
    const zodiacSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(zodiacSelect);
    const zodiacOption = screen.getByText(/Aries/i);
    fireEvent.click(zodiacOption);

    // Нажимаем кнопку "Next"
    const nextBtn = screen.getByRole('button', { name: /next/i });
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    expect(mockOnNext).toHaveBeenCalledWith({ weight: 80, height: 180, zodiac: 'Aries' });
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('initializes with default values', () => {
    expect(screen.getByText(/Height: 170/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight: 70 kg/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox').textContent).toBe('None');
  });
});
