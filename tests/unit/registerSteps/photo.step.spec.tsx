// tests/unit/registerSteps/photo.step.spec.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PhotoStep from '../../../src/components/registerSteps/PhotoStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from "../../../src/contexts/ErrorContext";
import { uploadLogo } from '../../../src/api/register';
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
    uploadLogo: jest.fn().mockResolvedValue({}),
}));

const mockUploadLogo = uploadLogo as jest.Mock;

describe('PhotoStep', () => {
    const mockOnNext = jest.fn();

    beforeEach(() => {
        mockOnNext.mockClear();
        mockShowError.mockClear();
        render(
            <ErrorProvider>
                <PhotoStep isu={123456} onNext={mockOnNext} />
            </ErrorProvider>
        );
    });

    it('renders the component', () => {
        expect(screen.getByText(/Upload Logo/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('button is disabled when no photo is uploaded', () => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toBeDisabled();
    });

    it('button is enabled when a photo is uploaded', () => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        const inputEl = screen.getByTestId('photo-input') as HTMLInputElement;
        expect(nextButton).toBeDisabled();

        fireEvent.change(inputEl, {
            target: { files: [new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' })] }
        });
        expect(nextButton).toBeEnabled();
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



    it('shows error if uploadLogo fails', async () => {
        mockUploadLogo.mockRejectedValueOnce(new Error('Upload error'));
        const inputEl = screen.getByTestId('photo-input');
        await act(async () => {
            fireEvent.change(inputEl, {
                target: { files: [new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' })] }
            });
            fireEvent.click(screen.getByRole('button', { name: /next/i }));
        });
        expect(mockShowError).toHaveBeenCalledWith('Upload error');
        expect(mockOnNext).not.toHaveBeenCalled();
    });
});