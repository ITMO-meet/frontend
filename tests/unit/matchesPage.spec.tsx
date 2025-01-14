import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchesPage from '../../src/components/pages/MatchesPage';
import { MemoryRouter } from 'react-router-dom';
import { PremiumContext } from '../../src/contexts/PremiumContext';
import { logEvent, logPageView } from '../../src/analytics'

jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
    logPageView: jest.fn(),
}));

jest.mock('../../src/stores/MatchesStore', () => ({
    matchesStore: {
        matches: [
            {
                isu: 123456,
                username: 'Jane Smith1',
                logo: 'https://example.com/logo1.jpg',
                photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
                mainFeatures: [{ text: '170 cm', icon: '📏' }],
                interests: [{ text: 'Music', icon: '🎵' }],
            },
            {
                isu: 789852,
                username: 'Jane Smith2',
                logo: 'https://example.com/logo2.jpg',
                photos: ['https://example.com/photo3.jpg'],
                mainFeatures: [{ text: '165 cm', icon: '📏' }],
                interests: [{ text: 'Traveling', icon: '✈️' }],
            },
        ],
        loadMatches: jest.fn(),
    },
}));

describe('MatchesPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderWithPremium = (isPremium: boolean) => {
        render(
            <MemoryRouter>
                <PremiumContext.Provider value={{ isPremium, setPremium: jest.fn() }}>
                    <MatchesPage />
                </PremiumContext.Provider>
            </MemoryRouter>
        );
    };

    test('renders premium block if user does not have premium', () => {
        renderWithPremium(false);

        expect(screen.getByText('Метчи разблокируются после покупки премиума.')).toBeInTheDocument();
        const button = screen.getByRole('button', { name: /Просмотреть план/i });
        expect(button).toBeInTheDocument();

        expect(logPageView).toHaveBeenCalledWith('/matches');
        expect(logEvent).toHaveBeenCalledWith('Matches', 'User without premium tried to view matches', 'User action (without premium)');
    });

    test('renders MatchesPage with all sections if user has premium', () => {
        renderWithPremium(true);

        expect(screen.getByText('Jane Smith1')).toBeInTheDocument();
        const currentPhoto = screen.getByAltText('Jane Smith1 photo 1');
        expect(currentPhoto).toBeInTheDocument();

        expect(logPageView).toHaveBeenCalledWith('/matches');
    });

    test('opens and closes the match list', async () => {
        renderWithPremium(true);

        const openListButton = screen.getByRole('button', { name: /open match list/i });
        fireEvent.click(openListButton);

        const matchList = screen.getByText('Match list');
        expect(matchList).toBeInTheDocument();

        const closeListButton = screen.getByRole('button', { name: /close match list/i });
        fireEvent.click(closeListButton);

        await waitFor(() => {
            expect(screen.queryByText('Match list')).not.toBeInTheDocument();
        });

        expect(logPageView).toHaveBeenCalledWith('/matches');
    });

    test('selects a match from the list', async () => {
        renderWithPremium(true);

        fireEvent.click(screen.getByRole('button', { name: /open match list/i }));

        const secondUser = screen.getByText('Jane Smith2');
        fireEvent.click(secondUser);

        await waitFor(() => {
            expect(screen.getByText('Jane Smith2')).toBeInTheDocument();
        });

        const secondUserPhoto = screen.getByAltText('Jane Smith2 photo 1');
        expect(secondUserPhoto).toBeInTheDocument();

        expect(logPageView).toHaveBeenCalledWith('/matches');
    });

    test('navigates between matches', async () => {
        renderWithPremium(true);

        const nextMatchButton = screen.getByRole('button', { name: /next match/i });
        const prevMatchButton = screen.getByRole('button', { name: /previous match/i });

        fireEvent.click(nextMatchButton);
        await waitFor(() => {
            expect(screen.getByText('Jane Smith2')).toBeInTheDocument();
        });

        fireEvent.click(prevMatchButton);
        await waitFor(() => {
            expect(screen.getByText('Jane Smith1')).toBeInTheDocument();
        });

        expect(logPageView).toHaveBeenCalledWith('/matches');
    });

    test('navigates between photos', async () => {
        renderWithPremium(true);

        const nextPhotoButton = screen.getByRole('button', { name: /next photo/i });
        const prevPhotoButton = screen.getByRole('button', { name: /previous photo/i });

        fireEvent.click(nextPhotoButton);
        await waitFor(() => {
            const secondPhoto = screen.getByAltText('Jane Smith1 photo 2');
            expect(secondPhoto).toBeInTheDocument();
        });

        fireEvent.click(prevPhotoButton);
        await waitFor(() => {
            const firstPhoto = screen.getByAltText('Jane Smith1 photo 1');
            expect(firstPhoto).toBeInTheDocument();
        });

        expect(logPageView).toHaveBeenCalledWith('/matches');
    });
});
