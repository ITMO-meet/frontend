import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProfilePage from '../../src/components/pages/ProfilePage';
import EditProfilePage from '../../src/components/pages/EditProfilePage';
import PremiumPage from '../../src/components/pages/PremiumPage';
import { PremiumProvider } from '../../src/contexts/PremiumContext';
import { logEvent, logPageView } from '../../src/analytics'

jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
    logPageView: jest.fn(),
}));

describe('ProfilePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        console.log = jest.fn();
    });

    test('renders ProfilePage with all sections', () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/profile']}>
                    <Routes>
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </MemoryRouter>
            </PremiumProvider>
        );

        // Проверка наличия заголовка
        expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();

        // Проверка наличия кнопки настроек
        expect(screen.getByTestId('SettingsIcon')).toBeInTheDocument();

        // Проверка наличия секции Bio
        expect(screen.getByText('Bio')).toBeInTheDocument();

        // Проверка наличия секции Main Features
        expect(screen.getByText('Main Features')).toBeInTheDocument();

        // Проверка наличия секции Interests
        expect(screen.getByText('Interests')).toBeInTheDocument();

        // Проверка наличия секции Languages
        expect(screen.getByText('Languages')).toBeInTheDocument();

        // Проверка наличия кнопки Premium
        expect(screen.getByText('Premium')).toBeInTheDocument();

        expect(logPageView).toHaveBeenCalledWith('/profile');
    });

    test('navigates to edit profile page on edit button click', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/profile']}>
                    <Routes>
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/edit-profile" element={<EditProfilePage />} />
                    </Routes>
                </MemoryRouter>
            </PremiumProvider>
        );

        // Нажатие на кнопку редактирования
        fireEvent.click(screen.getAllByTestId('EditIcon')[0]);

        // Проверка, что навигация выполнена
        await waitFor(() => {
            expect(screen.getByTestId('WestIcon')).toBeInTheDocument();
        });
        expect(logEvent).toHaveBeenCalledWith('Profile', 'To profile edit', 'Edit Profile Button');
    });

    test('navigates to premium page on Premium button click', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/profile']}>
                    <Routes>
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/premium" element={<PremiumPage />} />
                    </Routes>
                </MemoryRouter>
            </PremiumProvider>
        );

        // Нажатие на кнопку Premium
        fireEvent.click(screen.getByText('Premium'));

        // Проверка, что навигация выполнена
        await waitFor(() => {
            expect(screen.getByText('Это премиум. Вау!')).toBeInTheDocument();
        });
        expect(logEvent).toHaveBeenCalledWith('Profile', 'To premium click', 'Premium Button');
    });

    test('logs Settings button click', () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/profile']}>
                    <Routes>
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </MemoryRouter>
            </PremiumProvider>
        );

        // Нажатие на кнопку настроек
        fireEvent.click(screen.getByTestId('SettingsIcon'));

        // Проверка, что логирование выполнено
        expect(console.log).toHaveBeenCalledWith('Settings clicked');
    });
});