// UsernameStep.tsx
import { Box, FormControl, InputLabel, MenuItem, Select, Slider, TextField, Typography } from '@mui/material'; // Импортируем компоненты из MUI
import React, { useState } from 'react'; // Импортируем React и хук useState
import InputText from '../basic/InputText'; // Импортируем компонент для ввода текста
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки

// Определяем интерфейс для пропсов компонента
interface MainFeaturesStepProps {
    onNext: (data: { weight: number, height: number, zodiac: string }) => void; // Функция, которая будет вызвана при переходе к следующему шагу
}

// Основной компонент UsernameStep
const MainFeaturesStep: React.FC<MainFeaturesStepProps> = ({ onNext }) => {
    const [weight, setWeight] = useState(70); // Хук состояния для хранения веса
    const [height, setHeight] = useState(170); // Хук состояния для хранения роста
    const [zodiac, setZodiac] = useState('None'); // Хук состояния для хранения знака зодиака

    // Функция для обработки отправки данных
    const handleSubmit = () => {
        onNext({ weight, height, zodiac }); // Вызываем функцию onNext с введенными данными
    };

    return (
        <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
            <Typography variant="h5" align='center'>Enter some main information</Typography> {/* Заголовок */}
            
            {/* Слайдер для роста */}
            <Typography gutterBottom sx={{ marginTop: "20px" }}>Height: {height}</Typography>
            <Slider
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
