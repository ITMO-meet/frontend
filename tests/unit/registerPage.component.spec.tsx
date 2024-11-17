// RegisterPage.test.tsx
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import RegisterPage from '../../src/components/pages/RegisterPage';

interface StepProps {
	onNext: (data: object) => void;
}

// Мокаем компоненты шагов
jest.mock("../../src/components/registerSteps/UsernameStep", () => {
  const MockStep: React.FC<StepProps> = ({ onNext }) => (
    <div data-testid={`username-step`}><button onClick={() => onNext({ username: 'testuser' })}>Next</button></div>
  );
  return {
    __esModule: true,
    default: MockStep,
  };
});
	
jest.mock("../../src/components/registerSteps/GenderStep", () => {
  const MockStep: React.FC<StepProps> = ({ onNext }) => (
    <div data-testid={`gender-step`}><button onClick={() => onNext({ username: 'testuser' })}>Next</button></div>
  );
  return {
    __esModule: true,
    default: MockStep,
  };
});

jest.mock("../../src/components/registerSteps/TagsStep", () => {
  const MockStep: React.FC<StepProps> = ({ onNext }) => (
    <div data-testid={`tags-step`}><button onClick={() => onNext({ username: 'testuser' })}>Next</button></div>
  );
  return {
    __esModule: true,
    default: MockStep,
  };
});

jest.mock("../../src/components/registerSteps/PhotoStep", () => {
  const MockStep: React.FC<StepProps> = ({ onNext }) => (
    <div data-testid={`photo-step`}><button onClick={() => onNext({ username: 'testuser' })}>Next</button></div>
  );
  return {
    __esModule: true,
    default: MockStep,
  };
});

jest.mock("../../src/components/registerSteps/AdditionalPhotosStep", () => {
  const MockStep: React.FC<StepProps> = ({ onNext }) => (
    <div data-testid={`additional-photos-step`}><button onClick={() => onNext({ username: 'testuser' })}>Next</button></div>
  );
  return {
    __esModule: true,
    default: MockStep,
  };
});

jest.mock("../../src/components/registerSteps/GoalStep", () => {
  const MockStep: React.FC<StepProps> = ({ onNext }) => (
    <div data-testid={`goal-step`}><button onClick={() => onNext({ username: 'testuser' })}>Next</button></div>
  );
  return {
    __esModule: true,
    default: MockStep,
  };
});

// Мокаем useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('RegisterPage', () => {
  const mockNavigate = jest.fn();

	beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

	afterEach(() => {
    jest.clearAllMocks();
  });

	it('renders the registration page', () => {
		render(
			<MemoryRouter>
				<RegisterPage />
			</MemoryRouter>
		);

		expect(screen.getByText(/Registration/i)).toBeInTheDocument();
	});

	it('navigates through steps', () => {
		render(
			<MemoryRouter>
				<RegisterPage />
			</MemoryRouter>
		);

		// Проверяем первый шаг
		expect(screen.getByTestId('username-step')).toBeInTheDocument();
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем второй шаг
		expect(screen.getByTestId('gender-step')).toBeInTheDocument();
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем третий шаг
		expect(screen.getByTestId('tags-step')).toBeInTheDocument();
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем четвертый шаг
		expect(screen.getByTestId('photo-step')).toBeInTheDocument();
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем пятый шаг
		expect(screen.getByTestId('additional-photos-step')).toBeInTheDocument();
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем шестой шаг
		expect(screen.getByTestId('goal-step')).toBeInTheDocument();
		fireEvent.click(screen.getByText(/Next/i));

		// Здесь можно добавить проверку, что навигация произошла
		expect(mockNavigate).toHaveBeenCalled();
	});

	it('navigates back to the previous step', () => {
		render(
			<MemoryRouter>
				<RegisterPage />
			</MemoryRouter>
		);

		// Перейти к следующему шагу
		fireEvent.click(screen.getByText(/Next/i)); // username step
		fireEvent.click(screen.getByText(/Next/i)); // gender step

		// Проверяем, что мы на gender шаге
		expect(screen.getByTestId('tags-step')).toBeInTheDocument();

		// Нажимаем кнопку "Назад"
		const buttons = screen.getAllByRole('button');
		const backButton = buttons.find((button) => button.textContent !== 'Next') as HTMLElement;

		fireEvent.click(backButton);

		// Проверяем, что мы вернулись на username шаг
		expect(screen.getByTestId('gender-step')).toBeInTheDocument();
	});
});
