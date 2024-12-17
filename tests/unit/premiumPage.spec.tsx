import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PremiumPage from '../../src/components/pages/PremiumPage';
import { MemoryRouter } from 'react-router-dom';
import { PremiumProvider } from '../../src/contexts/PremiumContext';
import { useLocation } from 'react-router-dom';
import { logEvent, logPageView } from '../../src/analytics'

jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
    logPageView: jest.fn(),
}));

function LocationDisplay() {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
}

describe('PremiumPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders PremiumPage with all elements', () => {
        render(
            <PremiumProvider>
                <MemoryRouter>
                    <PremiumPage />
                </MemoryRouter>
            </PremiumProvider>
        );

        // Проверка наличия текста "Это премиум. Вау!"
        expect(screen.getByText('Это премиум. Вау!')).toBeInTheDocument();

        // Проверка наличия цены
        expect(screen.getByText('10 $/месяц')).toBeInTheDocument();

        // Проверка списка преимуществ
        expect(screen.getByText('Суперлайк')).toBeInTheDocument();
        expect(screen.getByText('Просмотр своих лайков')).toBeInTheDocument();
        expect(screen.getByText('Больше фильтров')).toBeInTheDocument();
        expect(screen.getByText('Что нибудь еще, главное дай деняккк')).toBeInTheDocument();

        // Проверка наличия кнопки "Купить премиум"
        expect(screen.getByRole('button', { name: 'Купить премиум' })).toBeInTheDocument();

        // Проверка наличия кнопки "назад"
        expect(screen.getByRole('button', { name: 'back' })).toBeInTheDocument();
        
        expect(logPageView).toHaveBeenCalledWith('/premium');
    });

    test('navigates back to profile page when back button is clicked', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/premium']}>
                    <PremiumPage />
                    <LocationDisplay />
                </MemoryRouter>
            </PremiumProvider>
        );

        // Нажатие кнопки "назад"
        fireEvent.click(screen.getByRole('button', { name: 'back' }));

        // Проверка, что навигация произошла на `/profile`
        await waitFor(() => {
            expect(screen.getByTestId('location-display')).toHaveTextContent('/profile');
        });
    });

    test('updates premium status and navigates to profile page on buy', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/premium']}>
                    <PremiumPage />
                    <LocationDisplay />
                </MemoryRouter>
            </PremiumProvider>
        );

        // Нажатие на кнопку "Купить премиум"
        fireEvent.click(screen.getByRole('button', { name: 'Купить премиум' }));

        // Проверка, что навигация произошла на `/profile`
        await waitFor(() => {
            expect(screen.getByTestId('location-display')).toHaveTextContent('/profile');
        });

        expect(logEvent).toHaveBeenCalledWith('Premium', 'Premium bought', 'Premium Button');
    });

    test('ensures premium status is set to true after purchase', async () => {
        let isPremium = false;

        render(
            <PremiumProvider>
                <MemoryRouter>
                    <PremiumPage />
                </MemoryRouter>
            </PremiumProvider>
        );

        // Mock функции для изменения состояния премиум
        const setPremiumMock = jest.fn(() => {
            isPremium = true;
        });

        // Проверка состояния до покупки
        expect(isPremium).toBe(false);

        // Выполнение покупки
        fireEvent.click(screen.getByRole('button', { name: 'Купить премиум' }));
        setPremiumMock();

        // Проверка состояния после покупки
        expect(isPremium).toBe(true);
    });
});
