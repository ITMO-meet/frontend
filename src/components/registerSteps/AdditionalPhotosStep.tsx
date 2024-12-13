// AdditionalPhotosStep.tsx
import { Box, Typography } from '@mui/material'; // Импортируем необходимые компоненты из MUI
import React, { useState } from 'react'; // Импортируем React и хук useState
import Gallery from '../basic/Gallery'; // Импортируем компонент галереи
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки
import PhotoEditor from '../pages/PhotoEditor';

// Определяем интерфейс для пропсов компонента
interface AdditionalPhotosStepProps {
  onNext: (data: { additionalPhotos: string[] }) => void; // Функция, которая будет вызвана при отправке дополнительных фотографий
}

// Основной компонент AdditionalPhotosStep
const AdditionalPhotosStep: React.FC<AdditionalPhotosStepProps> = ({ onNext }) => {
  // Хук состояния для хранения URL изображений в галерее
  const [galleryImages, setGalleryImages] = useState<string[]>(["", "", "", "", "", ""]); // Инициализируем массив из 6 пустых строк
  const [isEditing, setIsEditing] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Функция для удаления изображения по индексу
  const handleDeleteImage = (index: number) => {
    setGalleryImages((prev) => prev.map((p, i) => i !== index ? p : "")); // Устанавливаем пустую строку для удаляемого изображения
  };

  // Функция для загрузки изображения по индексу
  const handleLoadImage = (index: number, url: string) => {
    const newGal = [...galleryImages]; // Создаем новый массив изображений
    newGal[index] = url; // Обновляем URL изображения по индексу
    setGalleryImages(newGal); // Устанавливаем новый массив изображений
  };

  const handleEditImage = (index: number) => {
    if (galleryImages[index]) {
      setCurrentIndex(index);
      setImageToEdit(galleryImages[index]);
      setIsEditing(true);
    }
  };

  const handleSaveEditedImage = (editedImage: string) => {
    if (currentIndex !== null) {
      const newGal = [...galleryImages];
      newGal[currentIndex] = editedImage;
      setGalleryImages(newGal);
    }
  };

  // Функция для обработки отправки данных
  const handleSubmit = () => {
    if (galleryImages.some((img) => img)) {
      onNext({ additionalPhotos: galleryImages });
    }
  };

  return (
    <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
      <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>Add photo</Typography> {/* Заголовок */}
      <Typography variant="h6" align='center' sx={{ marginBottom: "20px" }}>At least one, but all six would be even better</Typography> {/* Подзаголовок с инструкцией */}
      {!isEditing && (
        <>
          <Gallery
            columns={3}
            rows={2}
            galleryImages={galleryImages}
            handleDeleteImage={handleDeleteImage}
            handleLoadImage={handleLoadImage}
            handleEditImage={handleEditImage}
          />
          <RoundButton
            onClick={handleSubmit}
            sx={{ width: "100%", marginTop: "20px" }} // Стили для кнопки
          >
            Next
          </RoundButton>
        </>
      )}

      {isEditing && imageToEdit && (
        <PhotoEditor
          image={imageToEdit}
          onSave={(edited) => {
            handleSaveEditedImage(edited);
            setIsEditing(false);
          }}
          onClose={() => setIsEditing(false)}
        />
      )}
    </Box>
  );
};

export default AdditionalPhotosStep; // Экспортируем компонент для использования в других частях приложения
