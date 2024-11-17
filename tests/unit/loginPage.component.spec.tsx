import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import LoginPage from '../../src/components/pages/LoginPage';
import '@testing-library/jest-dom';


jest.mock('../../src/components/pages/ChatPage', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="chat-page">ChatPage Component</div>,
    };
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('LoginPage', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders LoginPage with correct title', () => {
        const titleElement = screen.getByText(/login with itmo.id/i);
        expect(titleElement).toBeInTheDocument();
    });

    it('shows alert when ID is not 6 characters', () => {
        const idInput = screen.getByLabelText(/id/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const button = screen.getByText(/continue/i);

        // Enter an ID that is not 6 characters
        fireEvent.change(idInput, { target: { value: '123' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(button);

        // Check if the Snackbar is displayed with the correct message
        const alertMessage = screen.getByText(/ID must be exact 6 symbols/i);
        expect(alertMessage).toBeInTheDocument();
    });

    it('shows alert when password is empty', () => {
        const idInput = screen.getByLabelText(/id/i);
        const button = screen.getByText(/continue/i);

        // Enter a valid ID but leave password empty
        fireEvent.change(idInput, { target: { value: '123456' } });
        fireEvent.click(button);

        // Check if the Snackbar is displayed with the correct message
        const alertMessage = screen.getByText(/Password must not be empty/i);
        expect(alertMessage).toBeInTheDocument();
    });

    it('navigates to /chats when ID and password are valid', () => {
        const idInput = screen.getByLabelText(/id/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const button = screen.getByText(/continue/i);

        fireEvent.change(idInput, { target: { value: '123456' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledWith('/chats');
    });
});