// src/components/pages/RegisterPage.tsx

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
	const [direction, setDirection] = useState(1); // Initialize direction state

	const isu = Number(localStorage.getItem('isu') || '0');
	const [bio, setBio] = useState("");

	const handleNext = async () => {
		setDirection(1); // Set direction to forward
		setCurrentStep((prev) => prev + 1);
		if (currentStep === steps.length - 1) {
			handleFinish();
		}
	};

	const handleNextBio = async ({bio} : {bio: string}) => {
		setBio(bio);
		handleNext();
	}

	const handleBack = () => {
		setDirection(-1); // Set direction to backward
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const handleFinish = () => {
		// After registration, navigate to tests
		const initialTestId = 1;
		navigate(`/tests/${initialTestId}`);
	};

	const renderStep = () => {
		switch (steps[currentStep]) {
			case 'username':
				return <UsernameStep isu={isu} onNext={handleNext} />;
			case 'bio':
				return <BioStep isu={isu} onNext={handleNextBio} />;
			case 'main-feats':
				return <MainFeaturesStep isu={isu} bio={bio} onNext={handleNext} />;
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
			{/* Back button */}
			<div style={{ marginTop: '20px', minHeight: '60px' }}>
				{currentStep === 0 ? (
					<Box />
				) : (
					<ImageButton onClick={handleBack}>
						<WestIcon />
					</ImageButton>
				)}
			</div>
			<AnimatePresence mode="wait" custom={direction}>
				<PageWrapper key={currentStep} direction={direction}>
					{renderStep()}
				</PageWrapper>
			</AnimatePresence>
		</Container>
	);
};

export default RegisterPage;
