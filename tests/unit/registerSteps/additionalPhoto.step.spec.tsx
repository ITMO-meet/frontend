// AdditionalPhotosStep.test.tsx
import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import AdditionalPhotosStep from '../../../src/components/registerSteps/AdditionalPhotosStep';
import '@testing-library/jest-dom';
import {ErrorProvider} from "../../../src/contexts/ErrorContext";
jest.mock('../../../src/api/register');


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
    render(
        <ErrorProvider>
          <AdditionalPhotosStep isu={123456} onNext={mockOnNext} />
        </ErrorProvider>
    );
  });

  it('renders the component', () => {
    expect(screen.getByText(/Add additional photos/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls onNext with the correct additionalPhotos', async () => {
    const fileInputs = screen.getAllByTestId(/file-input-/i);
    await act(async () => {
      fireEvent.change(fileInputs[0], { target: { files: [new File(['img1'], 'photo1.jpg')] } });
      fireEvent.change(fileInputs[1], { target: { files: [new File(['img2'], 'photo2.jpg')] } });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    });

    expect(mockOnNext).toHaveBeenCalledWith({
      additionalPhotos: [expect.any(File), expect.any(File)]
    });
  });
});
