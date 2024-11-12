import React, { useState } from 'react';
import { Box, Button, Typography, Dialog, DialogContent, DialogActions, styled } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface TargetOption {
    icon: JSX.Element;
    label: string;
    description: string;
}

interface TargetSheetButtonProps {
    label: string;
    icon: JSX.Element;
    options: TargetOption[];
    onSelect: (option: TargetOption) => void;
}

// Основная кнопка для открытия BottomSheet с выбором цели
const CustomButton = styled(Button)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
    width: '100%',
    textTransform: 'none',
});

// Опция в списке выбора в BottomSheet
const OptionBox = styled(Box)<{ selected: boolean }>(({ theme, selected }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: selected ? theme.palette.action.selected : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const TargetSheetButton: React.FC<TargetSheetButtonProps> = ({ label, icon, options, onSelect }) => {
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false); // Управляет отображением BottomSheet
    const [tempSelectedOption, setTempSelectedOption] = useState<TargetOption | null>(null); // Временное хранение выбранной опции

    // Открыть BottomSheet
    const openBottomSheet = () => setBottomSheetOpen(true);
    // Закрыть BottomSheet
    const closeBottomSheet = () => {
        setTempSelectedOption(null); // Сбрасываем временную выбранную опцию
        setBottomSheetOpen(false);
    };

    // Установить временную опцию при клике по одной из опций
    const handleOptionClick = (option: TargetOption) => {
        setTempSelectedOption(option);
    };

    // Сохранить выбранную опцию и передать ее в родительский компонент, затем закрыть BottomSheet
    const handleSave = () => {
        if (tempSelectedOption) {
            onSelect(tempSelectedOption);
        }
        closeBottomSheet();
    };

    return (
        <>
            {/* Основная кнопка для открытия BottomSheet */}
            <CustomButton onClick={openBottomSheet}>
                <Box display="flex" alignItems="center">
                    {icon}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', ml: 1 }}>{label}</Typography>
                </Box>
                <ArrowForwardIosIcon fontSize="small" color="action" />
            </CustomButton>

            {/* BottomSheet для выбора цели */}
            <Dialog
                open={isBottomSheetOpen}
                onClose={closeBottomSheet}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '16px 16px 0 0',
                        position: 'fixed',
                        bottom: 0,
                        width: '100%',
                        m: 0
                    }
                }}
            >
                <DialogContent>
                    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>Укажите вашу цель</Typography>
                    <Box>
                        {/* Перебор массива опций для отображения каждого элемента в виде кликабельного блока */}
                        {options.map((option, index) => (
                            <OptionBox
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                selected={tempSelectedOption?.label === option.label}
                            >
                                {option.icon}
                                <Box ml={2}>
                                    <Typography variant="subtitle1" fontWeight="bold">{option.label}</Typography>
                                    <Typography variant="body2" color="textSecondary">{option.description}</Typography>
                                </Box>
                            </OptionBox>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeBottomSheet} fullWidth variant="outlined" color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSave} fullWidth variant="contained" color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TargetSheetButton;