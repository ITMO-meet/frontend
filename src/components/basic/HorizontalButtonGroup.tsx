import React, { useState } from 'react';
import { Button, Box, styled } from '@mui/material';
import IdProps from './IdProps';

interface HorizontalButtonGroupProps extends IdProps {
    options: string[]; // Список вариантов
    spacing: number; // Расстояние между кнопками в пикселях
    onButtonClick: (option: string) => void; // Функция для обработки клика по кнопке
}

const CustomButton = styled(Button)<{ selected: boolean }>(({ selected, theme }) => ({
    borderRadius: '5px', // Скругленные углы
    backgroundColor: selected ? theme.palette.secondary.dark : theme.palette.secondary.light,
    color: selected ? theme.palette.secondary.contrastText : theme.palette.primary.main, // Цвет текста
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark, // Цвет при наведении
    },
}));

const HorizontalButtonGroup: React.FC<HorizontalButtonGroupProps> = ({ options, spacing, onButtonClick }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(options[0]);
    return (
        <Box display="flex" gap={`${spacing}px`}>
            {options.map((option, index) => (
                <CustomButton
                    key={index}
                    variant="contained"
                    selected={selectedOption === option}
                    onClick={() => {onButtonClick(option); setSelectedOption(option)}}>
                    {option}
                </CustomButton>
            ))}
        </Box>
    );
};

export default HorizontalButtonGroup;