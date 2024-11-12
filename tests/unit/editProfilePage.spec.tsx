import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfilePage from '../../src/components/pages/EditProfilePage';

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
        render(<EditProfilePage />);

        // Открытие MultiCategorySheetButton
        fireEvent.click(screen.getByText('Choose Height'));

        // Выбор значения на слайдере и сохранение
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: 180 } });
        fireEvent.click(screen.getByText('Сохранить'));

        // Проверка, что выбранная опция сохраняется
        await waitFor(() => expect(screen.getByText('180')).toBeInTheDocument());
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

        // Проверка наличия изображений в галерее
        const images = screen.getAllByRole('img');
        expect(images.length).toBe(3);

        // Удаление изображения
        fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);

        // Проверка, что изображение удалено
        await waitFor(() => expect(screen.getAllByRole('img').length).toBe(2));
    });

    test('navigates back to profile page', async () => {
        render(<EditProfilePage />);

        // Нажатие на кнопку "Назад"
        fireEvent.click(screen.getByRole('button', { name: /back/i }));

        // Проверка, что навигация выполнена (можно добавить мок-функцию для подтверждения)
        await waitFor(() => expect(console.log).toHaveBeenCalledWith('Back to Profile'));
    });

    test('navigates to premium page', async () => {
        render(<EditProfilePage />);

        // Нажатие на кнопку Premium
        fireEvent.click(screen.getByText('Premium'));

        // Проверка, что навигация выполнена
        await waitFor(() => expect(console.log).toHaveBeenCalledWith('Premium Clicked'));
    });
});
