/**
 * Компонент RoundButton представляет собой кнопку с округлыми краями. Этот компонент позволяет
 * задать ширину кнопки, текст и функцию, выполняемую при нажатии. По умолчанию
 * кнопка использует основной цвет secondary из темы для фона и контрастный цвет для текста.
 * 
 * Параметры:
 * - `width` (опционально): задает ширину кнопки. Если не указана, применяется значение 80%.
 * - `children` (опционально): контент, отображаемый внутри кнопки (обычно текст).
 * - `onClick` (опционально): функция, которая будет выполнена при нажатии на кнопку.
 * - `id` (опционально): уникальный идентификатор для кнопки (предоставляется через интерфейс IdProps).
 * 
 * Пример использования:
 * 
 * ```
 * <RoundButton width="100%" onClick={() => console.log('Button clicked')}>
 *     Нажми меня
 * </RoundButton>
 * ```
 */

import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material';
import IdProps from './IdProps';

interface RoundButtonProps extends IdProps {
<<<<<<< HEAD
    width?: string;
    children?: React.ReactNode;
    onClick?: () => void;
=======
    disabled?: boolean, // Отключена ли кнопка
    width?: string, // Ширина кнопки
    children?: React.ReactNode, // Вложенные элементы
    onClick?: () => void // Действие по клику
>>>>>>> 968d60fea55ab33f8efba8f7bc5fa5a8db67b66e
}

const CustomButton = styled(Button)<RoundButtonProps>(({ width, theme }) => ({
    borderRadius: '100px',
    width: width || "80%",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
    },
}));

export const RoundButton: React.FC<RoundButtonProps> = ({ ...props }) => {
    return (
        <CustomButton variant="contained" {...props}>
            {props.children}
        </CustomButton>
    );
};

export default RoundButton;
