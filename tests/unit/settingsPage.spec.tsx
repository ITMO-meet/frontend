import React from 'react';
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import SettingsPage from '../../src/components/pages/SettingsPage';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('SettingsPage', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        render(
            <MemoryRouter>
                <SettingsPage />
            </MemoryRouter>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the SettingsPage with the correct title', () => {
        const titleElement = screen.getByText(/Настройки/i);
        expect(titleElement).toBeInTheDocument();
    });

    it('navigates back to the profile page when the back button is clicked', () => {
        const backButton = screen.getByTestId('BackToProfile');
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('opens and closes the notifications dialog', () => {
        const notificationsItem = screen.getByText('Уведомления');
        fireEvent.click(notificationsItem);

        const dialogTitle = screen.getByText('Уведомления');
        expect(dialogTitle).toBeInTheDocument();

        const closeButton = screen.getByText('Закрыть');
        fireEvent.click(closeButton);

        expect(screen.queryByText('Уведомления')).not.toBeInTheDocument();
    });

    it('toggles the notifications switch', () => {
        const notificationsItem = screen.getByText('Уведомления');
        fireEvent.click(notificationsItem);

        const switchElement = screen.getByRole('checkbox');
        expect(switchElement).toBeChecked();

        fireEvent.click(switchElement);
        expect(switchElement).not.toBeChecked();
    });

    it('opens and closes the language dialog', () => {
        const languageItem = screen.getByText('Язык');
        fireEvent.click(languageItem);

        const dialogTitle = screen.getByText('Выберите язык');
        expect(dialogTitle).toBeInTheDocument();

        const closeButton = screen.getByText('Закрыть');
        fireEvent.click(closeButton);

        expect(screen.queryByText('Выберите язык')).not.toBeInTheDocument();
    });

    it('changes the selected language', () => {
        const languageItem = screen.getByText('Язык');
        fireEvent.click(languageItem);

        const englishOption = screen.getByText('Английский');
        fireEvent.click(englishOption);

        const updatedLanguage = screen.getByText('Английский');
        expect(updatedLanguage).toBeInTheDocument();
    });

    it('opens and closes the problem dialog', () => {
        const problemItem = screen.getByText('Сообщить о проблеме');
        fireEvent.click(problemItem);

        const dialogTitle = screen.getByText('Сообщить о проблеме');
        expect(dialogTitle).toBeInTheDocument();

        const closeButton = screen.getByText('Закрыть');
        fireEvent.click(closeButton);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('submits a problem description', () => {
        const problemItem = screen.getByText('Сообщить о проблеме');
        fireEvent.click(problemItem);

        const textField = screen.getByLabelText('Опишите проблему');
        fireEvent.change(textField, { target: { value: 'Test problem' } });

        const submitButton = screen.getByText('Отправить');
        expect(submitButton).not.toBeDisabled();

        fireEvent.click(submitButton);

        // Check that the dialog is closed
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens and closes the exit dialog', async () => {
        const exitItem = screen.getByText('Выйти');
        fireEvent.click(exitItem);

        const dialogTitle = screen.getByText('Вы уверены, что хотите выйти?');
        expect(dialogTitle).toBeInTheDocument();

        const noButton = screen.getByText('Нет');
        fireEvent.click(noButton);

        // Wait for the dialog to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
    });

    it('handles the exit confirmation', () => {
        const exitItem = screen.getByText('Выйти');
        fireEvent.click(exitItem);

        const yesButton = screen.getByText('Да');
        fireEvent.click(yesButton);

        // Проверяем, что произошел переход на страницу входа
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
