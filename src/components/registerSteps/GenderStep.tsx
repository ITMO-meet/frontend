// GenderStep.tsx
import { Box, Typography} from '@mui/material';
import React, { useState } from 'react';
import { selectPreferences } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';
import RoundButton from "../basic/RoundButton";
import HorizontalButtonGroup from "../basic/HorizontalButtonGroup";
import { userData } from '../../stores/UserDataStore';

interface GenderStepProps {
    isu: number;
    onNext: (data: { gender: string }) => void;
}

const options = ["Мужчины", "Женщины", "Не важно"];

const GenderStep: React.FC<GenderStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [gender, setGender] = useState('');

    const handleChoose = (option: string) => {
        if (option === "Мужчины") setGender("Male")
        if (option === "Женщины") setGender("Female")
        if (option === "Не важно") setGender("Everyone")
    }

    const handleSubmit = async () => {
        if (!gender) {
            showError('Выберите ваше предпочтение');
            return;
        }
        try {
            if (gender != userData.getGenderPreference()) {
                await selectPreferences({ isu, gender_preference: gender });
                userData.setGenderPreference(gender, false);
            }
            onNext({ gender: gender });
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch(e: any) {
            showError(e.message);
        }
    };

    return (
        <Box padding="20px"> {/* Обертка с отступами */}
            <Typography variant="h5" align="center" sx={{ marginBottom: "20px" }}>
                Настройки знакомств
            </Typography> {/* Заголовок */}
            <Typography variant="h6" align="center">
                Показывать мне
            </Typography> {/* Подзаголовок с инструкцией */}
            <Box display="flex" justifyContent="center" padding="20px"> {/* Центрируем группу кнопок */}
                <HorizontalButtonGroup
                    options={options} // Передаем доступные варианты
                    spacing={10} // Промежуток между кнопками
                    onButtonClick={handleChoose} // Обработчик клика по кнопке для установки пола
                />
            </Box>
            <RoundButton
                onClick={handleSubmit} // Обработчик клика по кнопке
                disabled={gender === ''} // Кнопка отключена, если пол не выбран
                sx={{ width: "100%" }} // Стили для кнопки
            >
                Продолжить
            </RoundButton>
        </Box>
    );
};

export default GenderStep;
