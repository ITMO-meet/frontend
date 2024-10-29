/**
 * Компонент `PhotoListing` представляет собой галерею фотографий, которая позволяет пользователю
 * просматривать изображения, переключаясь между ними, нажимая на левую или правую половину фотографии.
 * 
 * Свойства:
 * - `photos` (string[]): Массив URL-адресов фотографий для отображения в галерее.
 * 
 * Внутреннее состояние:
 * - `currentIndex` (number): Индекс текущей отображаемой фотографии.
 * 
 * Основные функции:
 * - `handleNext`: Переключение на следующую фотографию.
 * - `handlePrev`: Переключение на предыдущую фотографию.
 * 
 * Как работает:
 * - Фотография заполняет всю ширину контейнера и масштабируется, чтобы покрыть всю высоту.
 * - Пользователь может переключаться между фотографиями, нажимая на левую или правую половину экрана.
 */

import React, { useState } from 'react';
import { Box } from '@mui/material';

interface PhotoListingProps {
    photos: string[]; // Массив URL-адресов фотографий
}

const PhotoListing: React.FC<PhotoListingProps> = ({ photos }) => {
    // Состояние для отслеживания текущего индекса фотографии
    const [currentIndex, setCurrentIndex] = useState(0);

    // Функция для перехода к следующей фотографии
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    // Функция для перехода к предыдущей фотографии
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

    return (
        <Box
            position="relative" // Контейнер с относительным позиционированием для правильного размещения навигации
            width="100%"
            height="400px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ overflow: 'hidden' }} // Скрытие областей изображения за пределами контейнера
        >
            {/* Отображение текущей фотографии */}
            <img
                src={photos[currentIndex]}
                alt="Profile photo"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // Масштабирование изображения для покрытия всего контейнера
                    userSelect: 'none', // Отключение возможности выделения изображения
                }}
            />

            {/* Левая область для навигации влево */}
            <Box
                position="absolute"
                left={0}
                width="50%"
                height="100%"
                onClick={handlePrev}
                sx={{ cursor: 'pointer', zIndex: 1 }} // Указатель курсора и слой выше изображения
            />

            {/* Правая область для навигации вправо */}
            <Box
                position="absolute"
                right={0}
                width="50%"
                height="100%"
                onClick={handleNext}
                sx={{ cursor: 'pointer', zIndex: 1 }} // Указатель курсора и слой выше изображения
            />
        </Box>
    );
};

export default PhotoListing;
