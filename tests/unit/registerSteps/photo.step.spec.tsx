// PhotoStep.test.tsx
import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import PhotoStep from '../../../src/components/registerSteps/PhotoStep';
import '@testing-library/jest-dom';
import {ErrorProvider} from "../../../src/contexts/ErrorContext";
jest.mock('../../../src/api/register');


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
      render(
          <ErrorProvider>
              <PhotoStep isu={123456} onNext={mockOnNext} />
          </ErrorProvider>
      );  });

    it('renders the component', () => {
        // Меняем строку поиска текста
        expect(screen.getByText(/Upload Logo/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('calls onNext with the correct photo when Next is clicked', async () => {
        const inputEl = screen.getByTestId('photo-input');
        await act(async () => {
            fireEvent.change(inputEl, {
                target: { files: [new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' })] }
            });
            fireEvent.click(screen.getByRole('button', { name: /next/i }));
        });
        expect(mockOnNext).toHaveBeenCalledWith({ photo: expect.any(File) });
    });


  it('button is disabled when no photo is uploaded', () => {
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled(); // Проверяем, что кнопка "Next" отключена
  });

    it('button is enabled when a photo is uploaded', () => {
        const inputEl = screen.getByTestId('photo-input');
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toBeDisabled();

        fireEvent.change(inputEl, {
            target: { files: [new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' })] }
        });
        expect(nextButton).toBeEnabled();
    });
});