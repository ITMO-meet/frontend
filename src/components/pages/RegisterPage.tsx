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
import BioStep from '../registerSteps/BioStep';
import MainFeaturesStep from '../registerSteps/MainFeaturesStep';
import PageWrapper from '../../PageWrapper';
import { AnimatePresence } from 'framer-motion';


const steps = [
	'username',
	'bio',
	'main-feats',
	'gender',
	'tags',
	'photo',
	'additional-photos',
	'goal',
];

export const RegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(0);
	const [userData, setUserData] = useState<object>({});
	const [direction, setDirection] = useState(1); // направление анимации. 1 - вперед, -1 - назад

	const handleNext = (data: object) => {
		setDirection(1);
		const newData = { ...userData, ...data }
		setUserData(newData);
		setCurrentStep((prev) => prev + 1);
		if (currentStep === steps.length - 1) {
			handleFinish(newData);
		}
	};

	const handleBack = () => {
		setDirection(-1);
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const handleFinish = (data: object) => {
		console.log('Registration complete:', data);
		// TODO: send data
		// TODO: pass initinl test id
		const initialTestId = 1;
		navigate(`/tests/${initialTestId}`);
	};

	const renderStep = () => {
		switch (steps[currentStep]) {
			case 'username':
				return <UsernameStep onNext={handleNext} />;
			case 'bio':
				return <BioStep onNext={handleNext} />;
			case 'main-feats':
				return <MainFeaturesStep onNext={handleNext} />;
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
			{/* Back button */}
			<div style={{ marginTop: '20px', minHeight: '60px' }}>
				{currentStep === 0 ? (<Box />) : (<ImageButton onClick={handleBack}><WestIcon /></ImageButton>)}
			</div>
			<AnimatePresence mode="wait" custom={direction}>
				<PageWrapper key={currentStep} direction={direction}>
					{renderStep()}
				</PageWrapper>
			</AnimatePresence>
		</Container >
	);
};

export default RegisterPage;
