// AdditionalPhotosStep.tsx
import { Box, Typography } from '@mui/material'; // Импортируем необходимые компоненты из MUI
import React, { useState } from 'react'; // Импортируем React и хук useState
import Gallery from '../basic/Gallery'; // Импортируем компонент галереи
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки

// Определяем интерфейс для пропсов компонента
interface AdditionalPhotosStepProps {
  onNext: (data: { additionalPhotos: string[] }) => void; // Функция, которая будет вызвана при отправке дополнительных фотографий
}

// Основной компонент AdditionalPhotosStep
const AdditionalPhotosStep: React.FC<AdditionalPhotosStepProps> = ({ onNext }) => {
  // Хук состояния для хранения URL изображений в галерее
  const [galleryImages, setGalleryImages] = useState<string[]>(["", "", "", "", "", ""]); // Инициализируем массив из 6 пустых строк

  // Функция для удаления изображения по индексу
  const handleDeleteImage = (index: number) => {
    setGalleryImages((prev) => prev.map((p, i) => i !== index ? p : "")); // Устанавливаем пустую строку для удаляемого изображения
  };

  // Функция для редактирования изображения по индексу
  const handleEditImage = (index: number, url: string) => {
    const newGal = [...galleryImages]; // Создаем новый массив изображений
    newGal[index] = url; // Обновляем URL изображения по индексу
    setGalleryImages(newGal); // Устанавливаем новый массив изображений
  };

  // Функция для обработки отправки данных
  const handleSubmit = () => {
    if (galleryImages) { // Проверяем, что массив изображений существует
      onNext({ additionalPhotos: galleryImages }); // Вызываем функцию onNext с массивом дополнительных фотографий
    }
  };

  return (
    <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
      <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>Add photo</Typography> {/* Заголовок */}
      <Typography variant="h6" align='center' sx={{ marginBottom: "20px" }}>At least one, but all six would be even better</Typography> {/* Подзаголовок с инструкцией */}
      <Gallery 
        columns={3} // Указываем количество столбцов в галерее
        rows={2} // Указываем количество строк в галерее
        galleryImages={galleryImages} // Передаем массив изображений в галерею
        handleDeleteImage={handleDeleteImage} // Передаем обработчик удаления изображения
        handleLoadImage={handleEditImage} // Передаем обработчик загрузки/редактирования изображения
      />
      <RoundButton 
        onClick={handleSubmit} // Обработчик клика по кнопке
        sx={{ width: "100%", marginTop: "20px" }} // Стили для кнопки
      >
        Next
      </RoundButton>
    </Box>
  );
};

export default AdditionalPhotosStep; // Экспортируем компонент для использования в других частях приложения
