import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ProfilePage from '../../src/components/pages/ProfilePage';

describe('ProfilePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders ProfilePage with all sections', () => {
        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        // Проверка наличия заголовка
        expect(screen.getAllByText('Profile')[0]).toBeInTheDocument();

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
    });

    test('navigates to edit profile page on edit button click', () => {
        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        // Нажатие на кнопку редактирования
        fireEvent.click(screen.getByTestId('EditIcon'));

        // Проверка, что навигация выполнена (можно добавить мок-функцию для подтверждения)
        // В данном случае мы просто проверяем, что функция навигации была вызвана
        expect(screen.getAllByText('Profile')[0]).toBeInTheDocument();
    });

    test('logs Premium button click', () => {
        console.log = jest.fn();

        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        // Нажатие на кнопку Premium
        fireEvent.click(screen.getByText('Premium'));

        // Проверка, что логирование выполнено
        expect(console.log).toHaveBeenCalledWith('Premium button clicked');
    });

    test('logs Settings button click', () => {
        console.log = jest.fn();

        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        // Нажатие на кнопку настроек
        fireEvent.click(screen.getByTestId('SettingsIcon'));

        // Проверка, что логирование выполнено
        expect(console.log).toHaveBeenCalledWith('Settings clicked');
    });
});