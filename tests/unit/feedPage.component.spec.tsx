import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeedPage from '../../src/components/pages/FeedPage';
import '@testing-library/jest-dom';
import { logEvent, logPageView } from '../../src/analytics'
import { PremiumProvider } from '../../src/contexts/PremiumContext';
import { feedStore } from '../../src/stores/FeedStore';
import { likePerson, dislikePerson, superLikePerson } from '../../src/api/feed';

jest.mock('../../src/api/feed', () => ({
    likePerson: jest.fn(() => Promise.resolve({ message: 'ok' })),
    dislikePerson: jest.fn(() => Promise.resolve({ message: 'ok' })),
    superLikePerson: jest.fn(() => Promise.resolve({ message: 'ok' })),
}));

jest.mock('../../src/contexts/PremiumContext', () => ({
    usePremium: () => ({ isPremium: true }),
    PremiumProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));


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
        getRelationshipPreferenceId: jest.fn().mockReturnValue("672b44eab151637e969889bc"),
        getWorldview: jest.fn().mockReturnValue("World"),
        getChildren: jest.fn().mockReturnValue("Children"),
        getLanguages: jest.fn().mockReturnValue(["Russian"]),
        getAlcohol: jest.fn().mockReturnValue("Ok"),
        getSmoking: jest.fn().mockReturnValue("Ok"),
        getInterests: jest.fn().mockReturnValue(["Reading", "Traveling", "Cooking"]),
        // Добавьте другие методы по мере необходимости
        setInterests: jest.fn(),
        setRelationshipPreferenceId: jest.fn(),
        getPhoto: jest.fn(),
        getAdditionalPhotos: jest.fn().mockReturnValue(["https://example.com/photo1.png", "https://example.com/photo2.png"]),
        getGender: jest.fn()
    }
}));

describe('FeedPage', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        feedStore.reset();
    });

    it('renders the component correctly', () => {
        render(
            <PremiumProvider>
                <FeedPage
                />
            </PremiumProvider>
        );

        expect(feedStore.getCurrentPerson).toHaveBeenCalledTimes(1);
        expect(feedStore.loadNewPerson).toHaveBeenCalledTimes(1); // on repoen we load new person (for filters to apply)
        expect(screen.getByText('Поиск')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('A sample person')).toBeInTheDocument();

        expect(logPageView).toHaveBeenCalledWith('/feed');
    });

    it('calls onLike when swiped right', async () => {
        render(
            <PremiumProvider>
                <FeedPage
                />
            </PremiumProvider>
        );

        const button = screen.getByTestId("FavoriteIcon");
        fireEvent.click(button);

        await waitFor(() => {
            expect(feedStore.loadNewPerson).toHaveBeenCalledTimes(1);
            expect(screen.getByText('John Doe2')).toBeInTheDocument();
            expect(screen.getByText('A sample person2')).toBeInTheDocument();
        });

        expect(likePerson).toHaveBeenCalledWith(1, person1.isu);
        expect(logEvent).toHaveBeenCalledWith('Feed', 'User pressed/swiped like', '');
    });

    it('calls onDislike when swiped left', async () => {
        render(
            <PremiumProvider>
                <FeedPage
                />
            </PremiumProvider>
        );


        const button = screen.getByTestId("CloseIcon");
        fireEvent.click(button);

        await waitFor(() => {
            expect(feedStore.loadNewPerson).toHaveBeenCalledTimes(1);
            expect(screen.getByText('John Doe2')).toBeInTheDocument();
            expect(screen.getByText('A sample person2')).toBeInTheDocument();
        });

        expect(dislikePerson).toHaveBeenCalledWith(1, person1.isu);
        expect(logEvent).toHaveBeenCalledWith('Feed', 'User pressed/swiped dislike', '');
    });

    it('calls onSuperLike when swiped up', async () => {
        render(
            <PremiumProvider>
                <FeedPage
                />
            </PremiumProvider>
        );

        const button = screen.getByTestId("StarIcon");
        fireEvent.click(button);

        await waitFor(() => {
            expect(feedStore.loadNewPerson).toHaveBeenCalledTimes(1);
            expect(screen.getByText('John Doe2')).toBeInTheDocument();
            expect(screen.getByText('A sample person2')).toBeInTheDocument();
        });

        expect(superLikePerson).toHaveBeenCalledWith(1, person1.isu);
        expect(logEvent).toHaveBeenCalledWith('Feed', 'User pressed/swiped superlike', '');
    });
});
