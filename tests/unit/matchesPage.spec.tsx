import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchesPage from '../../src/components/pages/MatchesPage';
import { MemoryRouter } from 'react-router-dom';
import { PremiumContext } from '../../src/contexts/PremiumContext';

const mockPeople = [
    {
        isu: 123456,
        username: 'Jane Smith1',
        logo: 'https://steamuserimages-a.akamaihd.net/ugc/1844789643806854188/FB581EAD503907F56A009F85371F6FB09A467FEC/?imw=512&imh=497&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
        photos: [
            'https://randomwordgenerator.com/img/picture-generator/54e7d7404853a914f1dc8460962e33791c3ad6e04e507440752972d29e4bc3_640.jpg',
            'https://randomwordgenerator.com/img/picture-generator/54e2d34b4a52aa14f1dc8460962e33791c3ad6e04e507749742c78d59e45cc_640.jpg',
        ],
        mainFeatures: [
            { text: '170 cm', icon: <span>📏</span> },
            { text: 'Atheism', icon: <span>🛐</span> },
        ],
        interests: [
            { text: 'Music', icon: <span>🎵</span> },
            { text: 'GYM', icon: <span>🏋️</span> },
        ],
    },
    {
        isu: 789852,
        username: 'Jane Smith2',
        logo: 'https://i.pinimg.com/736x/56/21/7b/56217b1ef6a69a2583ff13655d48bc53.jpg',
        photos: [
            'https://randomwordgenerator.com/img/picture-generator/53e9d7444b50b10ff3d8992cc12c30771037dbf852547849752678d5964e_640.jpg',
        ],
        mainFeatures: [
            { text: '165 cm', icon: <span>📏</span> },
            { text: 'Catholicism', icon: <span>🛐</span> },
        ],
        interests: [
            { text: 'Traveling', icon: <span>✈️</span> },
        ],
    },
];

describe('MatchesPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderWithPremium = (isPremium: boolean) => {
        render(
            <MemoryRouter>
                <PremiumContext.Provider value={{ isPremium, setPremium: jest.fn() }}>
                    <MatchesPage people={mockPeople} />
                </PremiumContext.Provider>
            </MemoryRouter>
        );
    };

    test('renders premium block if user does not have premium', () => {
        renderWithPremium(false);

        expect(screen.getByText('Метчи разблокируются после покупки премиума.')).toBeInTheDocument();
        const button = screen.getByRole('button', { name: /Просмотреть план/i });
        expect(button).toBeInTheDocument();
    });

    test('renders MatchesPage with all sections if user has premium', () => {
        renderWithPremium(true);

        expect(screen.getByText('Jane Smith1')).toBeInTheDocument();
        const currentPhoto = screen.getByAltText('Jane Smith1 photo 1');
        expect(currentPhoto).toBeInTheDocument();
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
    });
});
