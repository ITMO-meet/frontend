import React from 'react';
import { styled } from '@mui/material';
import { TextField } from '@mui/material';
import IdProps from './IdProps';

interface InputTextProps extends IdProps {
    width?: string, // Ширина поля ввода
    label?: string // Надпись в поле ввода
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void // Дейсвтие при изменении
}

const CustomInput = styled(TextField)<InputTextProps>(({ width, theme }) => ({
    borderRadius: '0px',
    width: width || "30%",
    backgroundColor: theme.palette.secondary.light
}));

export const InputText: React.FC<InputTextProps> = ({ ...props }) => {
    return (
        <CustomInput variant="filled" {...props} />
    );
};

export default InputText;
