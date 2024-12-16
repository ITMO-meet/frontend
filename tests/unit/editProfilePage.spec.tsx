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

jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
    logPageView: jest.fn(),
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
        expect(screen.getByText('Alisa Pipisa, 20')).toBeInTheDocument();

        // Проверка наличия секций
        expect(screen.getByText('Bio')).toBeInTheDocument();
        expect(screen.getByText('Target')).toBeInTheDocument();
        expect(screen.getByText('Main Features')).toBeInTheDocument();
        expect(screen.getByText((content, element) => content.includes('Интересы'))).toBeInTheDocument();
        expect(screen.getByText('Gallery')).toBeInTheDocument();
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
        await waitFor(() => expect(screen.getByText('Dates')).toBeInTheDocument());
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

    test('selects interests', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <EditProfilePage />
                </MemoryRouter>
            </PremiumProvider>
        );

        // Открытие модального окна для выбора интересов
        fireEvent.click(screen.getByText('Добавьте свои интересы'));

        // Выбор интересов
        fireEvent.click(screen.getByText((content) => content.includes('Путешествия')));
        fireEvent.click(screen.getByText((content) => content.includes('Чтение')));

        // Применение выбора
        fireEvent.click(screen.getByText('Применить'));

        // Проверка интересов
        await waitFor(() => {
            expect(screen.getByText((content) => content.includes('Путешествия'))).toBeInTheDocument();
            expect(screen.getByText((content) => content.includes('Чтение'))).toBeInTheDocument();
        });
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