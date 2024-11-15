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

const steps = [
	'username',
	'gender',
	'tags',
	'photo',
	'additional-photos',
	'goal',
];

const RegisterPage: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [userData, setUserData] = useState<object>({});

	const handleNext = (data: object) => {
		console.log(data);
		const newData = { ...userData, ...data }
		setUserData(newData);
		setCurrentStep((prev) => prev + 1);
		if (currentStep === steps.length - 1) {
			handleFinish(newData);
		}
	};

	const handleBack = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const handleFinish = (data: object) => {
		console.log('Registration complete:', data);
	};

	const renderStep = () => {
		switch (steps[currentStep]) {
			case 'username':
				return <UsernameStep onNext={handleNext} />;
			case 'gender':
				return <GenderStep onNext={handleNext} />;
			case 'tags':
				return <TagsStep onNext={handleNext} />;
			case 'photo':
				return <PhotoStep onNext={handleNext} />;
			case 'additional-photos':
				return <AdditionalPhotosStep onNext={handleNext} />;
			case 'goal':
				return <GoalStep onNext={handleNext} />;
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
