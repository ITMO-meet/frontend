import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { IdProps } from './IdProps';
import RoundButton from './RoundButton';
import theme from '../theme';

const defaultOptions = [
  'Нет',
  '>',
  '>',
  'Затрудняюсь ответить',
  '<',
  '<',
  'Да',
];

const circleSizes = [
  48, 40, 32, 24, 32, 40, 48
]

const gradients = [
  'linear-gradient(to right, #D21616, #D21616)',
  'linear-gradient(to right, #D21616, #ED7474)',
  'linear-gradient(to right, #ED7474, #E98D0D)',
  'linear-gradient(to right, #E98D0D, #E98D0D)',
  'linear-gradient(to right, #E98D0D, #62E460)',
  'linear-gradient(to right, #62E460, #129E39)',
  'linear-gradient(to right, #129E39, #129E39)'
]

const styles = {
  choiceContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  optionsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  circle: (index: number, size: number, isSelected: boolean) => ({
    width: size,
    height: size,
    position: 'relative',
    borderRadius: '50%',
    margin: `${size * 0.2}px auto`,
    border: `${size * 0.2}px solid white`,
    background: isSelected ? gradients[index] : "#fff",
    '&:hover': {
      border: `${size * 0.1}px solid white`,
    },
  }),
  innerCircle: (index: number, size: number) => ({
    borderRadius: '50%',
    position: 'absolute',
    inset: `-${size * 0.3}px`,
    background: gradients[index],
    zIndex: -1,
  })
};

interface QuestionChoiceProps extends IdProps {
  options?: string[]; // Список вариантов
  onFinish?: (ans: string) => void; // Функция для обработки клика по кнопке
}

export const QuestionChoice: React.FC<QuestionChoiceProps> = ({ options = defaultOptions, onFinish }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionClick = (index: number) => setSelectedOption(index);
  const handleFinishClick = () => {
    if (onFinish && selectedOption !== null) {
      onFinish(options[selectedOption]);
    }
  };

  return (
    <Box sx={styles.choiceContainer}>
      <Box sx={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = selectedOption === index;
          return (
            <Box key={index} sx={styles.optionContainer}>
              <Box   onClick={() => handleOptionClick(index)} sx={styles.circle(index, circleSizes[index], isSelected)}>
                <Box sx={styles.innerCircle(index, circleSizes[index])} />
              </Box>
              <Typography color={theme.palette.primary.dark}>{option}</Typography>
            </Box>
          );
        })}
      </Box>
      <RoundButton disabled={selectedOption === null} width="40%" onClick={handleFinishClick}>Continue</RoundButton>
    </Box>
  );
};
