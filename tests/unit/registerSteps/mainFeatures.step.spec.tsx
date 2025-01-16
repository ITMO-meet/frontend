import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MainFeaturesStep from '../../../src/components/registerSteps/MainFeaturesStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from '../../../src/contexts/ErrorContext';

export const mockShowError = jest.fn();

// This re-mock must appear BEFORE the component is imported
jest.mock('../../../src/contexts/ErrorContext', () => {
  const actual = jest.requireActual('../../../src/contexts/ErrorContext');
  return {
    __esModule: true,
    ...actual,
    useError: () => ({
      showError: mockShowError
    }),
  };
});
jest.mock('../../../src/api/register', () => ({
  __esModule: true,
  profileDetails: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../../src/stores/UserDataStore', () => ({
  userData: {
      loading: false,
      getIsu: jest.fn().mockReturnValue(1),
      getUsername: jest.fn().mockReturnValue("Alisa Pipisa"),
      getBio: jest.fn().mockReturnValue("Test Bio"),
      getBirthdate: jest.fn().mockReturnValue("2000-01-01"),
      getAge: jest.fn().mockReturnValue(20),
      getWeight: jest.fn().mockReturnValue(70),
      getHeight: jest.fn().mockReturnValue(100),
      getZodiac: jest.fn().mockReturnValue("Capricorn"),
      getGenderPreference: jest.fn().mockReturnValue("Everyone"),
      getRelationshipPreferenceId: jest.fn().mockReturnValue("672b44eab151637e969889bc"),
      getWorldview: jest.fn().mockReturnValue("World"),
      getChildren: jest.fn().mockReturnValue("Children"),
      getLanguages: jest.fn().mockReturnValue(["Russian"]),
      getAlcohol: jest.fn().mockReturnValue("Ok"),
      getSmoking: jest.fn().mockReturnValue("Ok"),
      getInterests: jest.fn().mockReturnValue(["Reading", "Traveling", "Cooking"]),
      getInterestIDs: jest.fn().mockReturnValue([""]),
      // Добавьте другие методы по мере необходимости
      setInterests: jest.fn(),
      setWeight: jest.fn(),
      setHeight: jest.fn(),
      setBio: jest.fn(),
      setZodiac: jest.fn(),
      setRelationshipPreferenceId: jest.fn(),
      getPhoto: jest.fn(),
      getAdditionalPhotos: jest.fn().mockReturnValue(["https://example.com/photo1.png", "https://example.com/photo2.png"]),
      getGender: jest.fn()
  }
}));

describe('MainFeaturesStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear(); // Сбрасываем мок перед каждым тестом
    render(
      <ErrorProvider>
        <MainFeaturesStep isu={123456} bio={"Some bio"} onNext={mockOnNext} />
      </ErrorProvider>
    );
  });

  it('renders the component', () => {
    expect(screen.getByText(/Введите основную информацию/i)).toBeInTheDocument();
    expect(screen.getByText(/Рост:/i)).toBeInTheDocument();
    expect(screen.getByText(/Вес:/i)).toBeInTheDocument();
    expect(screen.getByText(/Знак зодиака/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /продолжить/i })).toBeInTheDocument();
  });

  it('calls onNext with the correct data when Next is clicked', async () => {
    // Изменяем вес
    const weightSlider = screen.getAllByRole("slider")[1];
    fireEvent.change(weightSlider, { target: { value: 80 } });

    // Изменяем рост
    const heightSlider = screen.getAllByRole("slider")[0];
    fireEvent.change(heightSlider, { target: { value: 180 } });

    // Изменяем знак зодиака
    const zodiacSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(zodiacSelect);
    const zodiacOption = screen.getByText(/Лев/i);
    fireEvent.click(zodiacOption);

    // Нажимаем кнопку "Next"
    const nextBtn = screen.getByRole('button', { name: /продолжить/i });
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    expect(mockOnNext).toHaveBeenCalledWith({ weight: 80, height: 180, zodiac: 'Leo' });
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('initializes with default values', () => {
    expect(screen.getByText(/Рост: 170/i)).toBeInTheDocument();
    expect(screen.getByText(/Вес: 70 kg/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox').textContent).toBe('Нет');
  });
});
