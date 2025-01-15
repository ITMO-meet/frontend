// tests/unit/registerSteps/additionalPhoto.step.spec.tsx

import React from 'react';
import { render, screen} from '@testing-library/react';
//import {fireEvent, act, waitFor } from '@testing-library/react';

import AdditionalPhotosStep from '../../../src/components/registerSteps/AdditionalPhotosStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from "../../../src/contexts/ErrorContext";
import { uploadCarousel } from '../../../src/api/register';

// Mocking useError
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

// Mocking uploadCarousel API
jest.mock('../../../src/api/register', () => ({
  __esModule: true,
  uploadCarousel: jest.fn(),
}));

const mockUploadCarousel = uploadCarousel as jest.Mock;

describe('AdditionalPhotosStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    mockShowError.mockClear();
    mockUploadCarousel.mockClear();
    render(
        <ErrorProvider>
          <AdditionalPhotosStep isu={123456} onNext={mockOnNext} />
        </ErrorProvider>
    );
  });

  it('renders the component', () => {
    expect(screen.getByText(/Выберите дополнительные фотографии/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /продолжить/i })).toBeInTheDocument();
  });

  // it('calls onNext with the correct additionalPhotos', async () => {
  //   // Mock uploadCarousel to resolve successfully
  //   mockUploadCarousel.mockResolvedValueOnce({});
  //
  //   // Find all file inputs (file-input-0 to file-input-5)
  //   const fileInputs = screen.getAllByTestId(/file-input-\d+/i);
  //
  //   // Simulate uploading two photos
  //   await act(async () => {
  //     fireEvent.change(fileInputs[0], { target: { files: [new File(['img1'], 'photo1.jpg', { type: 'image/jpeg' })] } });
  //     fireEvent.change(fileInputs[1], { target: { files: [new File(['img2'], 'photo2.jpg', { type: 'image/jpeg' })] } });
  //   });
  //
  //   // Click the "Next" button
  //   await act(async () => {
  //     fireEvent.click(screen.getByRole('button', { name: /продолжить/i }));
  //   });
  //
  //   // Wait for onNext to be called
  //   await waitFor(() => {
  //     expect(mockOnNext).toHaveBeenCalledWith({
  //       additionalPhotos: [
  //         expect.any(File),
  //         expect.any(File)
  //       ]
  //     });
  //   });
  // });

  // it('shows error if no photos selected', async () => {
  //   // Click the "Next" button without selecting any photos
  //   await act(async () => {
  //     fireEvent.click(screen.getByRole('button', { name: /продолжить/i }));
  //   });
  //
  //   // Wait for showError to be called
  //   await waitFor(() => {
  //     expect(mockShowError).toHaveBeenCalledWith('Please select at least one photo');
  //   });
  //
  //   // Ensure onNext is not called
  //   expect(mockOnNext).not.toHaveBeenCalled();
  // });

  // it('shows error if uploadCarousel fails', async () => {
  //   // Mock uploadCarousel to reject
  //   mockUploadCarousel.mockRejectedValueOnce(new Error('Carousel error'));
  //
  //   // Find all file inputs
  //   const fileInputs = screen.getAllByTestId(/file-input-\d+/i);
  //
  //   // Simulate uploading one photo
  //   await act(async () => {
  //     fireEvent.change(fileInputs[0], { target: { files: [new File(['img1'], 'photo1.jpg', { type: 'image/jpeg' })] } });
  //   });
  //
  //   // Click the "Next" button
  //   await act(async () => {
  //     fireEvent.click(screen.getByRole('button', { name: /продолжить/i }));
  //   });
  //
  //   // Wait for showError to be called
  //   await waitFor(() => {
  //     expect(mockShowError).toHaveBeenCalledWith('Carousel error');
  //   });
  //
  //   // Ensure onNext is not called
  //   expect(mockOnNext).not.toHaveBeenCalled();
  // });
});
