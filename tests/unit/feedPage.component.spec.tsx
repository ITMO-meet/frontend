import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeedPage from '../../src/components/pages/FeedPage';
import '@testing-library/jest-dom';
import { logEvent, logPageView } from '../../src/analytics'
import { PremiumProvider } from '../../src/contexts/PremiumContext';
import { feedStore } from '../../src/stores/FeedStore';

jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
    logPageView: jest.fn(),
}));

const person1 = {
    isu: 1,
    logo: 'https://example.com/image.jpg',
    username: 'John Doe',
    bio: 'A sample person',
}
const person2 = {
    isu: 2,
    logo: 'https://example.com/image.jpg',
    username: 'John Doe2',
    bio: 'A sample person2',
}

jest.mock('../../src/stores/FeedStore', () => {
    let currentPerson = person1;
    return {
        feedStore: {
            loading: false,
            getAgePreference: jest.fn().mockReturnValue([18, 60]),
            getHeightPreference: jest.fn().mockReturnValue([150, 200]),
            getRelationshipPreference: jest.fn().mockReturnValue(["Male"]),
            getCurrentPerson: jest.fn().mockImplementation(() => currentPerson),
            loadNewPerson: jest.fn().mockImplementation(() => {
                currentPerson = person2;
            }),

            reset: () => { currentPerson = person1 }
        }
    };
});

jest.mock('../../src/stores/UserDataStore', () => ({
    userData: {
        loading: false,
        getIsu: jest.fn().mockReturnValue(1),
        getUsername: jest.fn().mockReturnValue("Alisa Pipisa"),
        getBio: jest.fn().mockReturnValue("Test Bio"),
        getBirthdate: jest.fn().mockReturnValue("2000-01-01"),
        getAge: jest.fn().mockReturnValue(20),
        getWeight: jest.fn().mockReturnValue(70),
        getHeight: jest.fn().mockReturnValue(100),
        getZodiac: jest.fn().mockReturnValue("Capricorn"),
        getGenderPreference: jest.fn().mockReturnValue("Everyone"),
        getRelationshipPreference: jest.fn().mockReturnValue("672b44eab151637e969889bc"),
        getWorldview: jest.fn().mockReturnValue("World"),
        getChildren: jest.fn().mockReturnValue("Children"),
        getLanguages: jest.fn().mockReturnValue(["Russian"]),
        getAlcohol: jest.fn().mockReturnValue("Ok"),
        getSmoking: jest.fn().mockReturnValue("Ok"),
        getInterests: jest.fn().mockReturnValue(["Reading", "Traveling", "Cooking"]),
        // Добавьте другие методы по мере необходимости
        setInterests: jest.fn(),
        setRelationshipPreference: jest.fn(),
        getPhoto: jest.fn(),
        getAdditionalPhotos: jest.fn().mockReturnValue(["https://example.com/photo1.png", "https://example.com/photo2.png"]),
        getGender: jest.fn()
    }
}));

describe('FeedPage', () => {
    let mockOnLike = jest.fn();
    let mockOnSuperLike = jest.fn();
    let mockOnDislike = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        feedStore.reset();
    });

    it('renders the component correctly', () => {
        render(
            <PremiumProvider>  
                <FeedPage
                    onLike={mockOnLike}
                    onSuperLike={mockOnSuperLike}
                    onDislike={mockOnDislike}
                />
            </PremiumProvider>
        );

        expect(feedStore.getCurrentPerson).toHaveBeenCalledTimes(1);
        expect(feedStore.loadNewPerson).toHaveBeenCalledTimes(0);
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('A sample person')).toBeInTheDocument();

        expect(logPageView).toHaveBeenCalledWith('/feed');
    });

    it('calls onLike when swiped right', async () => {
        render(
            <PremiumProvider>  
                <FeedPage
                    onLike={mockOnLike}
                    onSuperLike={mockOnSuperLike}
                    onDislike={mockOnDislike}
                />
            </PremiumProvider>
        );

        const button = screen.getByTestId("FavoriteIcon");
        fireEvent.click(button);

        expect(mockOnLike).toHaveBeenCalledWith(person1);
        await waitFor(() => {
            expect(feedStore.loadNewPerson).toHaveBeenCalledTimes(1);
            expect(screen.getByText('John Doe2')).toBeInTheDocument();
            expect(screen.getByText('A sample person2')).toBeInTheDocument();
        });
        
        expect(logEvent).toHaveBeenCalledWith('Feed', 'User pressed/swiped like', '');
    });

    it('calls onDislike when swiped left', async () => {
        render(
            <PremiumProvider>  
                <FeedPage
                    onLike={mockOnLike}
                    onSuperLike={mockOnSuperLike}
                    onDislike={mockOnDislike}
                />
            </PremiumProvider>
        );


        const button = screen.getByTestId("CloseIcon");
        fireEvent.click(button);

        expect(mockOnDislike).toHaveBeenCalledWith(person1);
        await waitFor(() => {
            expect(feedStore.loadNewPerson).toHaveBeenCalledTimes(1);
            expect(screen.getByText('John Doe2')).toBeInTheDocument();
            expect(screen.getByText('A sample person2')).toBeInTheDocument();
        });

        expect(logEvent).toHaveBeenCalledWith('Feed', 'User pressed/swiped dislike', '');
    });

    it('calls onSuperLike when swiped up', async () => {
        render(
            <PremiumProvider>  
                <FeedPage
                    onLike={mockOnLike}
                    onSuperLike={mockOnSuperLike}
                    onDislike={mockOnDislike}
                />
            </PremiumProvider>
        );

        const button = screen.getByTestId("StarIcon");
        fireEvent.click(button);

        expect(mockOnSuperLike).toHaveBeenCalledWith(person1);
        await waitFor(() => {
            expect(feedStore.loadNewPerson).toHaveBeenCalledTimes(1);
            expect(screen.getByText('John Doe2')).toBeInTheDocument();
            expect(screen.getByText('A sample person2')).toBeInTheDocument();
        });

        expect(logEvent).toHaveBeenCalledWith('Feed', 'User pressed/swiped superlike', '');
    });
});
