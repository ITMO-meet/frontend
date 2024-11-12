import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material';
import IdProps from './IdProps';

interface RoundButtonProps extends IdProps {
    disabled?: boolean, // Отключена ли кнопка
    width?: string, // Ширина кнопки
    children?: React.ReactNode, // Вложенные элементы
    onClick?: () => void // Действие по клику
}

const CustomButton = styled(Button)<RoundButtonProps>(({ width, theme }) => ({
    borderRadius: '100px', // Скругленные углы
    width: width || "80%",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText, // Цвет текста
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark, // Цвет при наведении
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
