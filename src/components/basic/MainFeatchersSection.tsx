/**
 * Компонент `MainFeaturesSection` представляет собой секцию с основными характеристиками профиля пользователя.
 * Включает в себя такие параметры, как рост, религиозные взгляды, знак зодиака, предпочтения по детям, отношение к алкоголю и курению.
 * 
 * Особенности:
 * - Каждый элемент отображается с иконкой и текстовым описанием.
 * - Для отображения знака зодиака используется отдельный компонент `ZodiacIcon`, который выводит соответствующий символ для каждого знака.
 * - Используется стилизация для карточек с характеристиками, включая фоновый цвет, границу и закругленные углы.
 * 
 * Параметры:
 * - `featureItems` (массив объектов): Массив данных для отображения характеристик, каждая из которых включает текст и иконку.
 * 
 * Внутренние компоненты:
 * - `ZodiacIcon`: Отображает символ зодиака в зависимости от переданного названия знака.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import StraightenIcon from '@mui/icons-material/Straighten';
import ChurchIcon from '@mui/icons-material/Church';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';

interface ZodiacIconProps {
    zodiac: string;
}

// Компонент для отображения символа зодиака на основе имени знака
const ZodiacIcon: React.FC<ZodiacIconProps> = ({ zodiac }) => {
    // Объект с символами зодиака для быстрого доступа
    const zodiacSymbols: { [key: string]: string } = {
        Aries: '♈️',
        Taurus: '♉️',
        Gemini: '♊️',
        Cancer: '♋️',
        Leo: '♌️',
        Virgo: '♍️',
        Libra: '♎️',
        Scorpio: '♏️',
        Sagittarius: '♐️',
        Capricorn: '♑️',
        Aquarius: '♒️',
        Pisces: '♓️'
    };

    // Возвращает символ зодиака или дефолтный символ '♈️', если знак не найден
    return <span>{zodiacSymbols[zodiac] || '♈️'}</span>;
};

// Массив с основными характеристиками профиля, включая текст и соответствующую иконку
const featureItems = [
    { text: '170 cm', icon: <StraightenIcon /> },              // Рост
    { text: 'Atheism', icon: <ChurchIcon /> },                 // Религиозные взгляды
    { text: 'Aries', icon: <ZodiacIcon zodiac="Aries" /> },    // Знак зодиака
    { text: 'No but would like', icon: <ChildCareIcon /> },    // Предпочтения по детям
    { text: 'Neutral', icon: <LocalBarIcon /> },               // Отношение к алкоголю
    { text: 'Neutral', icon: <SmokingRoomsIcon /> }            // Отношение к курению
];

// Главный компонент секции `MainFeaturesSection`, отвечающий за отображение всех характеристик
const MainFeaturesSection: React.FC = () => {
    return (
        <Box mt={2} width="100%">
            {/* Заголовок секции */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Main Features
            </Typography>
            
            {/* Отображение всех характеристик в виде карточек */}
            <Box display="flex" gap={1} flexWrap="wrap">
                {featureItems.map((item, index) => (
                    <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        sx={{
                            bgcolor: "rgba(214, 231, 255, 0.4)",          // Фоновый цвет с легкой прозрачностью
                            border: "1px solid rgba(214, 231, 255, 0.4)", // Граница в цвет фона
                            borderRadius: "8px",                          // Закругленные углы
                            padding: "4px 8px",                           // Внутренний отступ
                            gap: "4px"                                    // Расстояние между иконкой и текстом
                        }}
                    >
                        {item.icon}                                       {/* Иконка характеристики */}
                        <Typography>{item.text}</Typography>              {/* Текстовое описание */}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default MainFeaturesSection;
