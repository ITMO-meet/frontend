import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfilePage from '../../src/components/pages/EditProfilePage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import PremiumPage from '../../src/components/pages/PremiumPage';
import { PremiumProvider } from '../../src/contexts/PremiumContext';
import { logEvent, logPageView } from '../../src/analytics'
import { userData } from '../../src/stores/UserDataStore';

jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
    logPageView: jest.fn(),
}));

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
        getInterests: jest.fn().mockReturnValue({}),
        // Добавьте другие методы по мере необходимости
        setInterests: jest.fn(),
        setRelationshipPreference: jest.fn(),
        getPhoto: jest.fn().mockReturnValue("https://example.com/photo.jpg"),
        getAdditionalPhotos: jest.fn().mockReturnValue([
            "https://example.com/photo1.jpg",
            "https://example.com/photo2.jpg",
        ]),
    }
}));

function LocationDisplay() {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
}


describe('EditProfilePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders EditProfilePage with all sections', () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <EditProfilePage />
                </MemoryRouter>
            </PremiumProvider>
        );

        // Проверка наличия заголовка
        expect(screen.getByText('Alisa Pipisa')).toBeInTheDocument();
        expect(screen.getByText('Age: 20 yo')).toBeInTheDocument();

        // Проверка наличия секций
        expect(screen.getByText('Bio')).toBeInTheDocument();
        expect(screen.getByText('Target')).toBeInTheDocument();
        expect(screen.getByText('Main Features')).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('Интересы'))).toBeInTheDocument();
        expect(screen.getByText('Logo')).toBeInTheDocument();
        expect(screen.getByText('Additional Photos')).toBeInTheDocument();
        expect(screen.getByText('Premium')).toBeInTheDocument();

        // Проверка вызова logPageView
        expect(logPageView).toHaveBeenCalledWith('/edit-profile');
    });

    test('opens and selects target option', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <EditProfilePage />
                </MemoryRouter>
            </PremiumProvider>
        );

        // Открытие TargetSheetButton
        fireEvent.click(screen.getByText('Romantic relationships'));

        // Выбор опции и сохранение
        fireEvent.click(screen.getByText('Dates'));
        fireEvent.click(screen.getByText('Сохранить'));

        // Проверка, что выбранная опция отображается
        await waitFor(() => expect(userData.setRelationshipPreference).toHaveBeenCalledWith("672b44eab151637e969889bb"));
    });

    test('opens and selects main feature option', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter>
                    <EditProfilePage />
                </MemoryRouter>
            </PremiumProvider>
        );

        const chooseHeightButton = screen.getByRole('button', { name: "Height 100" });
        await userEvent.click(chooseHeightButton);

        const heightText = await screen.findByText('100');
        expect(heightText).toBeInTheDocument();
    });

    test('edits and deletes gallery images', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <EditProfilePage />
                </MemoryRouter>
            </PremiumProvider>
        );

        const images = screen.getAllByRole('img');
        expect(images.length).toBe(3);

        const buttons = screen.getAllByRole('button');

        fireEvent.click(buttons[0]);

        await waitFor(() => expect(screen.getAllByRole('img').length).toBe(3));
    });

    test('navigates back to profile page', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <EditProfilePage />
                    <LocationDisplay />
                </MemoryRouter>
            </PremiumProvider>
        );

        fireEvent.click(screen.getByTestId('BackToProfile'));

        await waitFor(() => {
            expect(screen.getByTestId('location-display')).toHaveTextContent('/profile');
        });
    });

    test('navigates to premium page on Premium button click', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <Routes>
                        <Route path="/edit-profile" element={<EditProfilePage />} />
                        <Route path="/premium" element={<PremiumPage />} />
                    </Routes>
                </MemoryRouter>
            </PremiumProvider>
        );
    
        // На��атие на кнопку Premium
        fireEvent.click(screen.getByText('Premium'));
    
        // Проверка, что навигация выполнена
        await waitFor(() => {
            expect(screen.getByText('Это премиум. Вау!')).toBeInTheDocument();
        });

        expect(logEvent).toHaveBeenCalledWith('Profile', 'To premium click', 'Premium Button');
    });
});