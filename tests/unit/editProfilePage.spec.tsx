import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfilePage from '../../src/components/pages/EditProfilePage';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';

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
            <MemoryRouter initialEntries={['/edit-profile']}>
                <EditProfilePage />
            </MemoryRouter>
        );

        // Проверка наличия заголовка
        expect(screen.getByText('Alisa Pipisa, 20')).toBeInTheDocument();

        // Проверка наличия секций
        expect(screen.getByText('Bio')).toBeInTheDocument();
        expect(screen.getByText('Target')).toBeInTheDocument();
        expect(screen.getByText('Main Features')).toBeInTheDocument();
        expect(screen.getByText('Interests')).toBeInTheDocument();
        expect(screen.getByText('Gallery')).toBeInTheDocument();
        expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    test('opens and selects target option', async () => {
        render(
            <MemoryRouter initialEntries={['/edit-profile']}>
                <EditProfilePage />
            </MemoryRouter>
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
            <MemoryRouter>
                <EditProfilePage />
            </MemoryRouter>
        );

        const chooseHeightButton = screen.getByRole('button', { name: "Height 100" });
        await userEvent.click(chooseHeightButton);

        const heightText = await screen.findByText('100');
        expect(heightText).toBeInTheDocument();
    });

    test('selects interests', async () => {
        render(
            <MemoryRouter initialEntries={['/edit-profile']}>
                <EditProfilePage />
            </MemoryRouter>
        );

        // Выбор интересов
        fireEvent.click(screen.getByText('Traveling'));
        fireEvent.click(screen.getByText('Books'));

        // Проверка состояния (выбранные интересы отображаются)
        await waitFor(() => {
            expect(screen.getByText('Traveling')).toBeInTheDocument();
            expect(screen.getByText('Books')).toBeInTheDocument();
        });
    });

    test('edits and deletes gallery images', async () => {
        render(
            <MemoryRouter initialEntries={['/edit-profile']}>
                <EditProfilePage />
            </MemoryRouter>
        );

        const images = screen.getAllByRole('img');
        expect(images.length).toBe(3);

        const buttons = screen.getAllByRole('button');

        fireEvent.click(buttons[0]);

        await waitFor(() => expect(screen.getAllByRole('img').length).toBe(3));
    });

    test('navigates back to profile page', async () => {
        render(
            <MemoryRouter initialEntries={['/edit-profile']}>
                <EditProfilePage />
                <LocationDisplay />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByTestId('BackToProfile'));

        await waitFor(() => {
            expect(screen.getByTestId('location-display')).toHaveTextContent('/profile');
        });
    });

    test('navigates to premium page', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        render(
            <MemoryRouter initialEntries={['/edit-profile']}>
                <EditProfilePage />
            </MemoryRouter>
        );

        // Нажатие на кнопку Premium
        fireEvent.click(screen.getByText('Premium'));

        // Проверка, что навигация выполнена
        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Premium Clicked'));
    });
});
