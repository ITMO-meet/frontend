// RegisterPage.tsx
import WestIcon from '@mui/icons-material/West';
import { Box, Container, Typography } from '@mui/material';
import React, { useState } from 'react';
import ImageButton from '../basic/ImageButton';
import AdditionalPhotosStep from '../registerSteps/AdditionalPhotosStep';
import GenderStep from '../registerSteps/GenderStep';
import GoalStep from '../registerSteps/GoalStep';
import PhotoStep from '../registerSteps/PhotoStep';
import TagsStep from '../registerSteps/TagsStep';
import UsernameStep from '../registerSteps/UsernameStep';
import { useNavigate } from 'react-router-dom';

const steps = [
	'username',
	'gender',
	'tags',
	'photo',
	'additional-photos',
	'goal',
];

export const RegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(0);

	const isu = Number(localStorage.getItem('isu') || '0');

	const handleNext = async () => {
		setCurrentStep((prev) => prev + 1);
		if (currentStep === steps.length - 1) {
			handleFinish();
		}
	};

	const handleBack = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const handleFinish = () => {
		// После завершения регистрации отправляем на тесты
		const initialTestId = 1;
		navigate(`/tests/${initialTestId}`);
	};

	const renderStep = () => {
		switch (steps[currentStep]) {
			case 'username':
				return <UsernameStep isu={isu} onNext={handleNext} />;
			case 'gender':
				return <GenderStep isu={isu} onNext={handleNext} />;
			case 'tags':
				return <TagsStep isu={isu} onNext={handleNext} />;
			case 'photo':
				return <PhotoStep isu={isu} onNext={handleNext} />;
			case 'additional-photos':
				return <AdditionalPhotosStep isu={isu} onNext={handleNext} />;
			case 'goal':
				return <GoalStep isu={isu} onNext={handleNext} />;
			default:
				return null;
		}
	};

	return (
		<Container maxWidth="sm" style={{ marginTop: '50px' }}>
			<Typography variant="h4" align="center" gutterBottom>
				Registration
			</Typography>
			<div style={{ marginTop: '20px', minHeight: '60px' }}>
				{currentStep === 0 ? (<Box/>) : (<ImageButton onClick={handleBack}><WestIcon /></ImageButton>)}
			</div>
			{renderStep()}
		</Container>
	);
};

export default RegisterPage;
