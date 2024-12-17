// tests/unit/loginPage.component.spec.tsx
import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import LoginPage from '../../src/components/pages/LoginPage';
import '@testing-library/jest-dom';
import {ErrorProvider} from "../../src/contexts/ErrorContext";

jest.mock('../../src/api/auth', () => ({
    __esModule: true,
    loginUser: jest.fn().mockResolvedValue({
        redirectUrl: 'http://localhost/auth/dashboard',
        isu: 123456
    }),
}));

jest.mock('../../src/components/pages/ChatPage', () => ({
    __esModule: true,
    default: () => <div data-testid="chat-page">ChatPage Component</div>,
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('LoginPage', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        render(
            <ErrorProvider>
                <MemoryRouter>
                    <LoginPage/>
                </MemoryRouter>
            </ErrorProvider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders LoginPage with correct title', () => {
        expect(screen.getByText(/login with itmo.id/i)).toBeInTheDocument();
    });

    it('shows alert when ID is not 6 characters', () => {
        const idInput = screen.getByLabelText(/id/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const button = screen.getByText(/continue/i);

        fireEvent.change(idInput, {target: {value: '123'}});
        fireEvent.change(passwordInput, {target: {value: 'password'}});
        fireEvent.click(button);

        expect(screen.getByText(/ID must be exactly 6 symbols/i)).toBeInTheDocument();
    });

    it('shows alert when password is empty', () => {
        const idInput = screen.getByLabelText(/id/i);
        const button = screen.getByText(/continue/i);

        fireEvent.change(idInput, {target: {value: '123456'}});
        fireEvent.click(button);

        expect(screen.getByText(/Password must not be empty/i)).toBeInTheDocument();
    });

    it('navigates to /chats when ID and password are valid', async () => {
        const idInput = screen.getByLabelText(/id/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const button = screen.getByText(/continue/i);

        fireEvent.change(idInput, {target: {value: '123456'}});
        fireEvent.change(passwordInput, {target: {value: 'password'}});

        await act(async () => {
            fireEvent.click(button);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/chats');
    });
});
