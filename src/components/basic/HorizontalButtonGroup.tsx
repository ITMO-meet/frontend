/**
 * Компонент `HorizontalButtonGroup` представляет группу горизонтально расположенных кнопок.
 * Каждая кнопка позволяет пользователю выбрать один из вариантов, переданных в `options`.
 * Выбранная кнопка меняет свой цвет, указывая, что она активна.
 * 
 * Свойства компонента:
 * - `options`: string[] — Массив строк с вариантами, которые будут отображаться на кнопках.
 * - `spacing`: number — Расстояние между кнопками в пикселях.
 * - `onButtonClick`: (option: string) => void — Функция-обработчик, вызываемая при клике на кнопку,
 *    передает в качестве аргумента выбранный вариант.
 * 
 * Внутреннее состояние:
 * - `selectedOption`: string | null — Состояние для хранения текущего выбранного варианта.
 * 
 * Пример использования:
 * 
 * ```typescript
 * <HorizontalButtonGroup
 *   options={['Option 1', 'Option 2', 'Option 3']}
 *   spacing={8}
 *   onButtonClick={(option) => console.log(`Выбрана опция: ${option}`)}
 * />
 * ```
 */

import React, { useState } from 'react';
import { Button, Box, styled } from '@mui/material';
import IdProps from './IdProps';

// Определяем интерфейс для свойств компонента HorizontalButtonGroupProps
interface HorizontalButtonGroupProps extends IdProps {
    options: string[];
    spacing: number;
    onButtonClick: (option: string) => void;
}

// Создаем стилизованную кнопку с использованием Material UI
const CustomButton = styled(Button)<{ selected: boolean }>(({ selected, theme }) => ({
    borderRadius: '5px',
    backgroundColor: selected ? theme.palette.secondary.dark : theme.palette.secondary.light,
    color: selected ? theme.palette.secondary.contrastText : theme.palette.primary.main,
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
    },
}));

const HorizontalButtonGroup: React.FC<HorizontalButtonGroupProps> = ({ options, spacing, onButtonClick }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    return (
        <Box display="flex" gap={`${spacing}px`}> {/* Используем Box для создания горизонтальной группы кнопок с заданным расстоянием между ними */}
            {options.map((option, index) => ( // Проходим по всем вариантам
                <CustomButton
                    key={index}
                    variant="contained"
                    selected={selectedOption === option}
                    onClick={() => {
                        onButtonClick(option);
                        setSelectedOption(option);
                    }}
                >
                    {option}
                </CustomButton>
            ))}
        </Box>
    );
};

export default HorizontalButtonGroup;
