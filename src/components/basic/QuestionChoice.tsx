import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { IdProps } from './IdProps';
import RoundButton from './RoundButton';
import theme from '../theme';

const defaultOptions = [
  'Нет',
  '>',
  '>',
  'Хм',
  '<',
  '<',
  'Да',
];

const circleSizes = [
  40, 32, 24, 20, 24, 32, 40, 48
]

// const gradients = [
  // 'linear-gradient(to right, #D21616, #D21616)',
  // 'linear-gradient(to right, #D21616, #ED7474)',
  // 'linear-gradient(to right, #ED7474, #E98D0D)',
  // 'linear-gradient(to right, #E98D0D, #E98D0D)',
  // 'linear-gradient(to right, #E98D0D, #62E460)',
  // 'linear-gradient(to right, #62E460, #129E39)',
  // 'linear-gradient(to right, #129E39, #129E39)'
// ]
const gradients = [
  "#4c1cd2  ",
  "#4238cc",
  "#3955c7",
  "#3070c2",
  "#2986be",
  "#219eba",
  "#16c0b3",
]

const styles = {
  choiceContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
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
    marginBottom: '16px',
  },
  circle: (index: number, size: number, isSelected: boolean) => ({
    width: size,
    height: size,
    position: 'relative',
    borderRadius: '50%',
    border: isSelected ? `${size * 0.1}px solid white` : `${size * 0.2}px solid white`,
    background: isSelected ? gradients[index] : "#fff",
    transition: 'border 0.3s',
    '&:hover': {
      border: `${size * 0.1}px solid white`,
    },
    marginBottom: `${circleSizes[0] - circleSizes[index] / 2}px`,
    marginTop: `${circleSizes[0] - circleSizes[index] / 2}px`,
  }),
  innerCircle: (index: number, size: number) => ({
    borderRadius: '50%',
    position: 'absolute',
    inset: `-${size * 0.3}px`,
    background: gradients[index],
    zIndex: -1,
  }),
  button: (isSelected: boolean) => ({
    marginTop: "16px",
    width: "100%",
    display: 'flex',
    justifyContent: 'center', // Добавлено для центрирования
    animation: `pulse ${isSelected ? "2" : "0"}s infinite`,
    '@keyframes pulse': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.1)' },
      '100%': { transform: 'scale(1)' },
    },
  })
};

interface QuestionChoiceProps extends IdProps {
  options?: string[]; // Список вариантов
  onFinish?: (ans: number) => void; // Функция для обработки клика по кнопке
}

export const QuestionChoice: React.FC<QuestionChoiceProps> = ({ options = defaultOptions, onFinish }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleFinish = () => {
    setSelectedOption(null);
    onFinish?.(selectedOption!);
  }

  return (
    <Box sx={styles.choiceContainer}>
      <Box sx={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = selectedOption === index;
          return (
            // Вариант ответа
            <Box key={index} sx={styles.optionContainer}>
              <Box className="option-choice" onClick={() => setSelectedOption(index)} sx={styles.circle(index, circleSizes[index], isSelected)}>
                <Box sx={styles.innerCircle(index, circleSizes[index])} />
              </Box>
              {/* Текст ответа */}
              <Typography color={theme.palette.primary.dark}>{option}</Typography>
            </Box>
          );
        })}
      </Box>
      {/* Кнопка */}
      <Box sx={styles.button(selectedOption !== null)}>
        <RoundButton disabled={selectedOption === null} width="80%" onClick={handleFinish}>Continue</RoundButton>
      </Box>
    </Box>
  );
};

export default QuestionChoice;