// RegisterPage.test.tsx
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

jest.mock("../../src/components/registerSteps/BioStep", () => {
	const MockStep: React.FC<StepProps> = ({ onNext }) => (
		<div data-testid={`bio-step`}><button onClick={() => onNext({ bio: 'testbio' })}>Next</button></div>
	);
	return {
		__esModule: true,
		default: MockStep,
	};
});

jest.mock("../../src/components/registerSteps/MainFeaturesStep", () => {
	const MockStep: React.FC<StepProps> = ({ onNext }) => (
		<div data-testid={`main-features-step`}><button onClick={() => onNext({ weight: 100, height: 100, zodiac: "Cancer" })}>Next</button></div>
	);
	return {
		__esModule: true,
		default: MockStep,
	};
});

jest.mock("../../src/components/registerSteps/GenderStep", () => {
	const MockStep: React.FC<StepProps> = ({ onNext }) => (
		<div data-testid={`gender-step`}><button onClick={() => onNext({ gender: 'male' })}>Next</button></div>
	);
	return {
		__esModule: true,
		default: MockStep,
	};
});

jest.mock("../../src/components/registerSteps/TagsStep", () => {
	const MockStep: React.FC<StepProps> = ({ onNext }) => (
		<div data-testid={`tags-step`}><button onClick={() => onNext({ tags: ["tag1", "tag2"] })}>Next</button></div>
	);
	return {
		__esModule: true,
		default: MockStep,
	};
});

jest.mock("../../src/components/registerSteps/PhotoStep", () => {
	const MockStep: React.FC<StepProps> = ({ onNext }) => (
		<div data-testid={`photo-step`}><button onClick={() => onNext({ photo: 'photo' })}>Next</button></div>
	);
	return {
		__esModule: true,
		default: MockStep,
	};
});

jest.mock("../../src/components/registerSteps/AdditionalPhotosStep", () => {
	const MockStep: React.FC<StepProps> = ({ onNext }) => (
		<div data-testid={`additional-photos-step`}><button onClick={() => onNext({ additionalPhotos: ["photo1", "photo2"] })}>Next</button></div>
	);
	return {
		__esModule: true,
		default: MockStep,
	};
});

jest.mock("../../src/components/registerSteps/GoalStep", () => {
	const MockStep: React.FC<StepProps> = ({ onNext }) => (
		<div data-testid={`goal-step`}><button onClick={() => onNext({ goal: 'goal' })}>Next</button></div>
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

		render(
			<MemoryRouter>
				<RegisterPage />
			</MemoryRouter>
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders the registration page', () => {
		expect(screen.getByText(/Регистрация/i)).toBeInTheDocument();
	});

	it('navigates through steps', async () => {
		// Проверяем шаг ника
		expect(screen.getByTestId('username-step')).toBeInTheDocument();
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем шаг описания
		await waitFor(() => {
			expect(screen.getByTestId('bio-step')).toBeInTheDocument();
		});
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем шаг основных параметров
		await waitFor(() => {
			expect(screen.getByTestId('main-features-step')).toBeInTheDocument();
		});
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем шаг гендера
		await waitFor(() => {
			expect(screen.getByTestId('gender-step')).toBeInTheDocument();
		});
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем шаг тэгов
		await waitFor(() => {
			expect(screen.getByTestId('tags-step')).toBeInTheDocument();
		});
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем шаг фото
		await waitFor(() => {
			expect(screen.getByTestId('photo-step')).toBeInTheDocument();
		});
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем шаг фоток
		await waitFor(() => {
			expect(screen.getByTestId('additional-photos-step')).toBeInTheDocument();
		});
		fireEvent.click(screen.getByText(/Next/i));

		// Проверяем шаг цели
		await waitFor(() => {
			expect(screen.getByTestId('goal-step')).toBeInTheDocument();
		});
		fireEvent.click(screen.getByText(/Next/i));

		// Здесь можно добавить проверку, что навигация произошла
		expect(mockNavigate).toHaveBeenCalled();
	});

	it('navigates back to the previous step', async () => {
		// Перейти к следующему шагу
		fireEvent.click(screen.getByText(/Next/i)); // username step
		fireEvent.click(screen.getByText(/Next/i)); // gender step

		// Проверяем, что мы на нужном шаге шаге
		await waitFor(() => {
			expect(screen.getByTestId('main-features-step')).toBeInTheDocument();
		});
		// Нажимаем кнопку "Назад"
		const buttons = screen.getAllByRole('button');
		const backButton = buttons.find((button) => button.textContent !== 'Next') as HTMLElement;

		fireEvent.click(backButton);

		// Проверяем, что мы вернулись
		await waitFor(() => {
			expect(screen.getByTestId('bio-step')).toBeInTheDocument();
		});
	});
});
