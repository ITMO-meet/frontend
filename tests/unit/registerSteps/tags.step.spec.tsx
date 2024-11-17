// TagsStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TagsStep from '../../../src/components/registerSteps/TagsStep';
import '@testing-library/jest-dom';

describe('TagsStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear(); // Сбрасываем мок перед каждым тестом
    render(<TagsStep onNext={mockOnNext} />);
  });

  it('renders the component', () => {
    expect(screen.getByText(/Main Interests/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls onNext with the correct tags when Next is clicked', () => {
    // Симулируем выбор тегов
    fireEvent.click(screen.getByText(/Спорт/i));
    fireEvent.click(screen.getByText(/Музыка/i));

    // Нажимаем кнопку "Next"
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockOnNext).toHaveBeenCalledWith({ tags: ['Спорт', 'Музыка'] });
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('calls onNext with an empty array when no tags are selected', () => {
    // Нажимаем кнопку "Next" без выбора тегов
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockOnNext).toHaveBeenCalledWith({ tags: [] });
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });
});
