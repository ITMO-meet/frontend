import { Box, FormControl, MenuItem, Select, Slider, Typography } from '@mui/material'; // Импортируем компоненты из MUI
import React, { useState } from 'react'; // Импортируем React и хук useState
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки
import { useError } from '../../contexts/ErrorContext';
import { profileDetails } from '../../api/register';

// Определяем интерфейс для пропсов компонента
interface MainFeaturesStepProps {
    isu: number,
    bio: string,
    onNext: (data: { weight: number, height: number, zodiac: string }) => void; // Функция, которая будет вызвана при переходе к следующему шагу
}

// Основной компонент UsernameStep
const MainFeaturesStep: React.FC<MainFeaturesStepProps> = ({ isu, bio, onNext }) => {
    const { showError } = useError();
    const [weight, setWeight] = useState(70); // Хук состояния для хранения веса
    const [height, setHeight] = useState(170); // Хук состояния для хранения роста
    const [zodiac, setZodiac] = useState('None'); // Хук состояния для хранения знака зодиака

    // Функция для обработки отправки данных
    const handleSubmit = async () => {
        try {
            await profileDetails({ isu, bio, weight, height, zodiac_sign: zodiac });
            // Pass the object so the test can verify
            onNext({ weight, height, zodiac }); // Вызываем функцию onNext с введенными данными          
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch(e: any) {
            showError(e.message);
        }
    };

    return (
        <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
            <Typography variant="h5" align='center'>Enter some main information</Typography> {/* Заголовок */}
            
            {/* Слайдер для роста */}
            <Typography gutterBottom sx={{ marginTop: "20px" }}>Height: {height}</Typography>
            <Slider
                data-testid="height-slider"
                name="height"
                value={height}
                onChange={(e, newValue) => setHeight(newValue as number)}
                min={100}
                max={250}
                step={1}
                valueLabelDisplay="auto"
            />

            {/* Слайдер для веса */}
            <Typography gutterBottom sx={{ marginTop: "20px" }}>Weight: {weight} kg</Typography>
            <Slider
                data-testid="height-slider"
                name="weight"
                value={weight}
                onChange={(e, newValue) => setWeight(newValue as number)}
                min={30}
                max={150}
                step={1}
                valueLabelDisplay="auto"
            />

            {/* Выбор знака зодиака */}
            <FormControl fullWidth>
                <Typography gutterBottom sx={{ marginTop: "20px" }}>Zodiac Sign</Typography>
                <Select
                    name='zodiac'
                    value={zodiac}
                    onChange={(e) => setZodiac(e.target.value as string)}
                    sx={{ marginY: "10px" }}
                >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="Aries">Aries</MenuItem>
                    <MenuItem value="Taurus">Taurus</MenuItem>
                    <MenuItem value="Gemini">Gemini</MenuItem>
                    <MenuItem value="Cancer">Cancer</MenuItem>
                    <MenuItem value="Leo">Leo</MenuItem>
                    <MenuItem value="Virgo">Virgo</MenuItem>
                    <MenuItem value="Libra">Libra</MenuItem>
                    <MenuItem value="Scorpio">Scorpio</MenuItem>
                    <MenuItem value="Sagittarius">Sagittarius</MenuItem>
                    <MenuItem value="Capricorn">Capricorn</MenuItem>
                    <MenuItem value="Aquarius">Aquarius</MenuItem>
                    <MenuItem value="Pisces">Pisces</MenuItem>
                </Select>
            </FormControl>
            <RoundButton
                onClick={handleSubmit} // Обработчик клика по кнопке
                sx={{ width: "100%" }} // Стили для кнопки
            >
                Next
            </RoundButton>
        </Box>
    );
};

export default MainFeaturesStep; // Экспортируем компонент для использования в других частях приложения
