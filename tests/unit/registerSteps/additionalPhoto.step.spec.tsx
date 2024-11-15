// AdditionalPhotosStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdditionalPhotosStep from '../../../src/components/registerSteps/AdditionalPhotosStep';
import '@testing-library/jest-dom';

interface MockGalleryProps {
  galleryImages: string[];
  handleDeleteImage: (index: number) => void;
  handleLoadImage: (index: number, url: string) => void;
  columns: number;
  rows: number;
}

jest.mock("../../../src/components/basic/Gallery", () => {
  const MockGallery: React.FC<MockGalleryProps> = ({ handleDeleteImage, handleLoadImage }) => (
    <div data-testid="gallery">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Image URL ${index + 1}`}
            onChange={(e) => handleLoadImage(index, e.target.value)}
          />
          <button onClick={() => handleDeleteImage(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
  return {
    __esModule: true,
    default: MockGallery,
  };
});

describe('AdditionalPhotosStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear(); // Сбрасываем мок перед каждым тестом
    render(<AdditionalPhotosStep onNext={mockOnNext} />);
  });

  it('renders the component', () => {
    expect(screen.getByText(/Add photo/i)).toBeInTheDocument();
    expect(screen.getByText(/At least one, but all six would be even better/i)).toBeInTheDocument();
    expect(screen.getByTestId(/gallery/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls onNext with the correct additionalPhotos when Next is clicked', () => {
    // Симулируем загрузку изображений
    fireEvent.change(screen.getAllByPlaceholderText(/Image URL/i)[0], {
      target: { value: 'http://example.com/photo1.jpg' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Image URL/i)[1], {
      target: { value: 'http://example.com/photo2.jpg' },
    });

    // Нажимаем кнопку "Next"
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockOnNext).toHaveBeenCalledWith({
      additionalPhotos: [
        'http://example.com/photo1.jpg',
        'http://example.com/photo2.jpg',
        '',
        '',
        '',
        '',
      ],
    });
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });
});
