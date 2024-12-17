// tests/unit/ChatsPage.spec.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatsPage from '../../src/components/pages/ChatsPage';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// eslint-disable-next-line react/display-name
jest.mock('../../src/components/basic/NavBar', () => () => <div data-testid="mocked-navbar"/>);

describe('ChatsPage', () => {
    it('renders the ChatsPage correctly', () => {
        render(
            <MemoryRouter>
                <ChatsPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Chats/i)).toBeInTheDocument();
        expect(screen.getByTestId('mocked-navbar')).toBeInTheDocument();
    });
});
