import { IconButton, styled } from "@mui/material";
import React from 'react';
import IdProps from "./IdProps";

interface ImageButtonProps extends IdProps {
    radius?: string, // Радиус кнопки
    children?: React.ReactNode, // Вложенный элемент
    onClick?: () => void // Действие по клику
}

const CustomButton = styled(IconButton)<ImageButtonProps>(({ radius, theme }) => ({
    borderRadius: "100%",
    width: radius || "56px",
    height: radius || "56px",
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.main
}));

export const ImageButton: React.FC<ImageButtonProps> = ({ ...props }) => {
    return (
        <CustomButton {...props} />
    );
};

export default ImageButton;