import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import TestsPage from '../../src/components/pages/TestsPage';

// Мокаем useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('TestsPage', () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Подмена useNavigate
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    // Mock window.alert
    window.alert = jest.fn();
  });

  test('renders page header and sections', () => {
    render(
      <BrowserRouter>
        <TestsPage />
      </BrowserRouter>
    );

    // Проверка заголовка
// Измените тест на:
    expect(screen.getByRole('heading', { name: /тесты/i })).toBeInTheDocument();

    // Проверка заголовков разделов
    expect(screen.getByText(/о личном/i)).toBeInTheDocument();
    expect(screen.getByText(/поговорим серьезно\?/i)).toBeInTheDocument();
    expect(screen.getByText(/обо всем на свете/i)).toBeInTheDocument();

    // Проверка отображения тестов
    expect(screen.getByAltText('Фетиши')).toBeInTheDocument();
    expect(screen.getByAltText('Психология')).toBeInTheDocument();
    expect(screen.getByAltText('Бытовуха')).toBeInTheDocument();
    expect(screen.getByAltText('Будущее')).toBeInTheDocument();
    expect(screen.getByAltText('Хобби')).toBeInTheDocument();
    expect(screen.getByAltText('Медиа')).toBeInTheDocument();
  });

  test('navigates to test page on click', () => {
    render(
      <BrowserRouter>
        <TestsPage />
      </BrowserRouter>
    );

    const testCard = screen.getByAltText('Фетиши');
    fireEvent.click(testCard);

    expect(navigateMock).toHaveBeenCalledWith('/tests/6787dc52c35a41da41946138');
  });

  test('shows alert for completed test', () => {
    render(
      <BrowserRouter>
        <TestsPage />
      </BrowserRouter>
    );

    const testCard = screen.getByAltText('Фетиши');

    // Имитация завершенного теста
    fireEvent.click(testCard);
    fireEvent.click(testCard);

    expect(window.alert).toHaveBeenCalledWith('Тест уже пройден. Показываем результат.');
  });

  test('renders images correctly', () => {
    render(
      <BrowserRouter>
        <TestsPage />
      </BrowserRouter>
    );

    // Проверка количества изображений
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(6);

    // Проверка, что изображения имеют корректный alt
    images.forEach((img) => {
      expect(img).toHaveAttribute('alt');
    });
  });
});
