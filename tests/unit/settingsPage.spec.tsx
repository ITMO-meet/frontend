import React from 'react';
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import SettingsPage from '../../src/components/pages/SettingsPage';
import '@testing-library/jest-dom';
import { logPageView } from '../../src/analytics'

jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
    logPageView: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
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
        getHeight: jest.fn().mockReturnValue(175),
        getZodiac: jest.fn().mockReturnValue("Capricorn"),
        // Добавьте другие методы по мере необходимости
    }
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

        expect(logPageView).toHaveBeenCalledWith('/settings');
    });

    it('navigates back to the profile page when the back button is clicked', () => {
        const backButton = screen.getByTestId('BackToProfile');
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('opens and closes the notifications dialog', async () => {
        const notificationsItem = screen.getByText('Уведомления', { selector: 'p' });
        fireEvent.click(notificationsItem);

        const dialogTitle = screen.getByText('Уведомления', { selector: 'h2' });
        expect(dialogTitle).toBeInTheDocument();

        const closeButton = screen.getByText('Закрыть');
        fireEvent.click(closeButton);

        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
    });

    it('toggles the notifications switch', () => {
        const notificationsItem = screen.getByText('Уведомления');
        fireEvent.click(notificationsItem);

        const switchElement = screen.getByRole('checkbox');
        expect(switchElement).toBeChecked();

        fireEvent.click(switchElement);
        expect(switchElement).not.toBeChecked();
    });

    it('opens and closes the language dialog', async () => {
        const languageItem = screen.getByText('Язык', { selector: 'p' });
        fireEvent.click(languageItem);

        const dialogTitle = screen.getByText('Выберите язык');
        expect(dialogTitle).toBeInTheDocument();

        const closeButton = screen.getByText('Закрыть');
        fireEvent.click(closeButton);

        await waitForElementToBeRemoved(() => screen.queryByText('Выберите язык'));
    });

    it('changes the selected language', () => {
        const languageItem = screen.getByText('Язык', { selector: 'p' });
        fireEvent.click(languageItem);

        const englishOption = screen.getByText('Английский', { selector: 'span' });
        fireEvent.click(englishOption);

        const updatedLanguage = screen.getByText('Английский', { selector: 'p' });
        expect(updatedLanguage).toBeInTheDocument();
    });

    it('opens and closes the problem dialog', async () => {
        const problemItem = screen.getByText('Сообщить о проблеме', { selector: 'p' });
        fireEvent.click(problemItem);

        const dialogTitle = screen.getByText('Сообщить о проблеме', { selector: 'h2' });
        expect(dialogTitle).toBeInTheDocument();

        const closeButton = screen.getByText('Закрыть');
        fireEvent.click(closeButton);

        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
    });

    it('submits a problem description', async () => {
        const problemItem = screen.getByText('Сообщить о проблеме', { selector: 'p' });
        fireEvent.click(problemItem);

        const textField = screen.getByLabelText('Опишите проблему');
        fireEvent.change(textField, { target: { value: 'Test problem' } });

        const submitButton = screen.getByText('Отправить');
        expect(submitButton).not.toBeDisabled();

        fireEvent.click(submitButton);

        // Ждем, пока диалог будет удален из DOM
        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
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
