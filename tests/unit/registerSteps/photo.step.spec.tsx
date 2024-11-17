// PhotoStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoStep from '../../../src/components/registerSteps/PhotoStep';
import '@testing-library/jest-dom';

interface MockGalleryProps {
    galleryImages: string[]; 
    handleDeleteImage: (index: number) => void;
    handleLoadImage: (index: number, url: string) => void;
    columns: number; // Количество колонок
    rows: number; // Количество строк
  }

jest.mock("../../../src/components/basic/Gallery", () => {
    const MockStep: React.FC<MockGalleryProps> = ({ handleDeleteImage, handleLoadImage,  }) => (
      <div data-testid={`gallery`}>
        <button onClick={() => handleDeleteImage(0)}>Delete</button>
        <button onClick={() => handleLoadImage(0, "photo.jpg")}>Load</button>
      </div>
    );
    return {
      __esModule: true,
      default: MockStep,
    };
  });

describe('PhotoStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear(); // Сбрасываем мок перед каждым тестом
    render(<PhotoStep onNext={mockOnNext} />);
  });

  it('renders the component', () => {
    expect(screen.getByText(/Upload your photo/i)).toBeInTheDocument();
    expect(screen.getByText(/Make sure the photo of your face is clear so that it can be easily verified/i)).toBeInTheDocument();
    expect(screen.getByTestId(/gallery/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls onNext with the correct photo when Next is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: /load/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockOnNext).toHaveBeenCalledWith({ photo: 'photo.jpg' });
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('button is disabled when no photo is uploaded', () => {
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled(); // Проверяем, что кнопка "Next" отключена
  });

  it('button is enabled when a photo is uploaded', () => {
    fireEvent.click(screen.getByRole('button', { name: /load/i }));

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeEnabled(); // Проверяем, что кнопка "Next" включена
  });
});