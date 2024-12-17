// tests/unit/registerSteps/AdditionalPhotosStep.test.tsx

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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





});
