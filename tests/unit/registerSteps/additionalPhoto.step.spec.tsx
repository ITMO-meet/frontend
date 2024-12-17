// AdditionalPhotosStep.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AdditionalPhotosStep from '../../../src/components/registerSteps/AdditionalPhotosStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from "../../../src/contexts/ErrorContext";
import { uploadCarousel } from '../../../src/api/register';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useError as originalUseError } from '../../../src/contexts/ErrorContext';

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
  uploadCarousel: jest.fn().mockResolvedValue({}),
}));

const mockUploadCarousel = uploadCarousel as jest.Mock;

describe('AdditionalPhotosStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    mockShowError.mockClear();
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

  it('shows error if no photos selected', async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    expect(mockShowError).toHaveBeenCalledWith('Please select at least one photo');
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('shows error if uploadCarousel fails', async () => {
    mockUploadCarousel.mockRejectedValueOnce(new Error('Carousel error'));
    const fileInputs = screen.getAllByTestId(/file-input-/i);

    await act(async () => {
      fireEvent.change(fileInputs[0], { target: { files: [new File(['img1'], 'photo1.jpg')] } });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    expect(mockShowError).toHaveBeenCalledWith('Carousel error');
    expect(mockOnNext).not.toHaveBeenCalled();
  });
});