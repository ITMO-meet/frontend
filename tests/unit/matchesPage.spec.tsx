import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchesPage from '../../src/components/pages/MatchesPage';
import { MemoryRouter } from 'react-router-dom';

describe('MatchesPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('renders MatchesPage with all sections', () => {
        render(
            <MemoryRouter>
                <MatchesPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Test user1')).toBeInTheDocument();

        const currentPhoto = screen.getByAltText('Test user1 photo 1');
        expect(currentPhoto).toBeInTheDocument();
    });


    test('opens and closes the match list', async () => {
        render(
            <MemoryRouter>
                <MatchesPage />
            </MemoryRouter>
        );

        const openListButton = screen.getByRole('button', { name: /open match list/i });
        fireEvent.click(openListButton);

        const matchList = screen.getByText('Match list');
        expect(matchList).toBeInTheDocument();

        const closeListButton = screen.getByRole('button', { name: /close match list/i });
        fireEvent.click(closeListButton);

        await waitFor(() => {
            expect(screen.queryByText('Match list')).not.toBeInTheDocument();
        });
    });


    test('selects a match from the list', async () => {
        render(
            <MemoryRouter>
                <MatchesPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /list/i }));

        const secondUser = screen.getByText('Test user2');
        fireEvent.click(secondUser);

        await waitFor(() => {
            expect(screen.getByText('Test user2')).toBeInTheDocument();
        });

        const secondUserPhoto = screen.getByAltText('Test user2 photo 1');
        expect(secondUserPhoto).toBeInTheDocument();
    });


    test('navigates between matches', async () => {
        render(
            <MemoryRouter>
                <MatchesPage />
            </MemoryRouter>
        );

        const nextMatchButton = screen.getByRole('button', { name: /next match/i });
        const prevMatchButton = screen.getByRole('button', { name: /previous match/i });

        fireEvent.click(nextMatchButton);
        await waitFor(() => {
            expect(screen.getByText('Test user2')).toBeInTheDocument();
        });

        fireEvent.click(prevMatchButton);
        await waitFor(() => {
            expect(screen.getByText('Test user1')).toBeInTheDocument();
        });
    });
});
