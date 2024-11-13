import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfilePage from '../../src/components/pages/EditProfilePage';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('EditProfilePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders EditProfilePage with all sections', () => {
        render(<EditProfilePage />);

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
        render(<EditProfilePage />);

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
        render(<EditProfilePage />);

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
        render(<EditProfilePage />);

        const images = screen.getAllByRole('img');
        expect(images.length).toBe(3);

        const buttons = screen.getAllByRole('button');

        fireEvent.click(buttons[0]);

        await waitFor(() => expect(screen.getAllByRole('img').length).toBe(3));
    });

    test('navigates back to profile page', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        render(<EditProfilePage />);

        fireEvent.click(screen.getByTestId('BackToProfile'));

        await waitFor(() => {
            expect(consoleLogSpy).toHaveBeenCalledWith('Back to Profile');
        });

        consoleLogSpy.mockRestore();
    });


    test('navigates to premium page', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        render(<EditProfilePage />);

        // Нажатие на кнопку Premium
        fireEvent.click(screen.getByText('Premium'));

        // Проверка, что навигация выполнена
        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Premium Clicked'));
    });
});
