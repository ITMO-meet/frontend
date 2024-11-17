import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { FallbackUI } from '../../src/components/FallbackUI';
import '@testing-library/jest-dom';

// Мокаем useNavigate для проверки навигации
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('FallbackUI Component', () => {
    const mockResetError = jest.fn();
    const mockNavigate = jest.fn();

    beforeEach(() => {
        // Сбрасываем мок перед каждым тестом
        jest.clearAllMocks();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    it('renders correctly', () => {
        render(<FallbackUI error={null} resetError={mockResetError} />);

        // Проверяем наличие элементов на экране
        expect(screen.getByText('😵‍💫')).toBeInTheDocument();
        expect(screen.getByText("Oops... Something wrong")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Return to Main/i })).toBeInTheDocument();
    });

    it('calls resetError and navigate on button click', () => {
        render(<FallbackUI error={null} resetError={mockResetError} />);

        // Находим кнопку и кликаем по ней
        fireEvent.click(screen.getByRole('button', { name: /Return to Main/i }));

        // Проверяем, что функции были вызваны
        expect(mockResetError).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});