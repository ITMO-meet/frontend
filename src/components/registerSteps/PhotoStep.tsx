// PhotoStep.tsx
import { Box, Typography } from '@mui/material'; // Импортируем компоненты из MUI
import React, { useState } from 'react'; // Импортируем React и хук useState
import Gallery from '../basic/Gallery'; // Импортируем компонент галереи для отображения изображений
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки

// Определяем интерфейс для пропсов компонента
interface PhotoStepProps {
  onNext: (data: { photo: string }) => void; // Функция, которая будет вызвана при переходе к следующему шагу с загруженной фотографией
}

// Основной компонент PhotoStep
const PhotoStep: React.FC<PhotoStepProps> = ({ onNext }) => {
  const [galleryImages, setGalleryImages] = useState<string[]>([""]); // Хук состояния для хранения изображений в галерее

  // Функция для удаления изображения по индексу
  const handleDeleteImage = (index: number) => {
    setGalleryImages((prev) => prev.map((p, i) => i !== index ? p : "")); // Заменяем изображение на пустую строку
  };

  // Функция для редактирования изображения по индексу
  const handleEditImage = (index: number, url: string) => {
    const newGal = [...galleryImages]; // Создаем копию текущего состояния галереи
    newGal[index] = url; // Обновляем изображение по указанному индексу
    setGalleryImages(newGal); // Обновляем состояние галереи
  };

  // Функция для обработки отправки данных
  const handleSubmit = () => {
    if (galleryImages[0]) { // Проверяем, что первое изображение не пустое
      onNext({ photo: galleryImages[0] }); // Вызываем функцию onNext с загруженной фотографией
    }
  };

  return (
    <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
      <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>Upload your photo</Typography> {/* Заголовок */}
      <Typography variant="h6" align='center' sx={{ marginBottom: "20px" }}>Make sure the photo of your face is clear so that it can be easily verified</Typography> {/* Подзаголовок с инструкцией */}
      <Gallery 
        columns={1} // Указываем количество колонок для отображения изображений
        rows={1} // Указываем количество строк для отображения изображений
        galleryImages={galleryImages} // Передаем изображения в галерею
        handleDeleteImage={handleDeleteImage} // Передаем функцию для удаления изображений
        handleLoadImage={handleEditImage} // Передаем функцию для загрузки/редактирования изображений
      />
      <RoundButton 
        onClick={handleSubmit} // Обработчик клика по кнопке
        disabled={galleryImages[0] === ''} // Кнопка отключена, если первое изображение пустое
        sx={{ width: "100%", marginTop: "20px" }} // Стили для кнопки
      >
        Next
      </RoundButton>
    </Box>
  );
};

export default PhotoStep; // Экспортируем компонент для использования в других частях приложения
