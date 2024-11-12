import React, { useState } from 'react';
import { Button, ButtonGroup, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import IdProps from './IdProps';

interface MultiSelectButtonsProps extends IdProps {
  options: string[], // Список вариантов
  onClickOption: (selectedOpts: string[]) => void // Действие по клику
}

const CustomButton = styled(Button)<{ selected: boolean }>(({ selected, theme }) => ({
  borderRadius: '5px', // Скругленные углы
  backgroundColor: selected ? theme.palette.secondary.dark : theme.palette.secondary.light,
  color: selected ? theme.palette.secondary.contrastText : theme.palette.primary.main, // Цвет текста
  '&:hover': {
      backgroundColor: theme.palette.secondary.dark, // Цвет при наведении
  },
}));

export const MultiSelectButtonGroup: React.FC<MultiSelectButtonsProps> = ({ ...props }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleToggle = (option: string) => {
    const newOptions = selectedOptions.includes(option) ? selectedOptions.filter((o) => o !== option) : [...selectedOptions, option]
    props.onClickOption(newOptions);
    setSelectedOptions(newOptions);
  };

  return (
    <ButtonGroup>
      {props.options.map((option) => (
        <CustomButton
          key={option}
          variant="contained"
          selected={selectedOptions.includes(option)}
          onClick={() => {handleToggle(option)}}
          startIcon={selectedOptions.includes(option) ? <CheckIcon /> : null}
        >
          {option}
        </CustomButton>
      ))}
    </ButtonGroup>
  );
};

export default MultiSelectButtonGroup;
