// PhotoStep.tsx
import { Box, Typography, Button } from '@mui/material'; // Импортируем компоненты из MUI
import React, { useState } from 'react'; // Импортируем React и хук useState
import Gallery from '../basic/Gallery'; // Импортируем компонент галереи для отображения изображений
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки
import PhotoEditor from '../pages/PhotoEditor';

// Определяем интерфейс для пропсов компонента
interface PhotoStepProps {
  onNext: (data: { photo: string }) => void; // Функция, которая будет вызвана при переходе к следующему шагу с загруженной фотографией
}

// Основной компонент PhotoStep
const PhotoStep: React.FC<PhotoStepProps> = ({ onNext }) => {
  const [galleryImages, setGalleryImages] = useState<string[]>([""]); // Хук состояния для хранения изображений в галерее
  const [isEditing, setIsEditing] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const image = reader.result as string;
        setGalleryImages([image]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Функция для удаления изображения по индексу
  const handleDeleteImage = (index: number) => {
    setGalleryImages((prev) => prev.map((p, i) => i !== index ? p : "")); // Заменяем изображение на пустую строку
  };

  // Функция для редактирования изображения по индексу
  // const handleEditImage = (index: number, url: string) => {
  //   const newGal = [...galleryImages]; // Создаем копию текущего состояния галереи
  //   newGal[index] = url; // Обновляем изображение по указанному индексу
  //   setGalleryImages(newGal); // Обновляем состояние галереи
  // };
  const handleEditImage = () => {
    if (galleryImages[0]) {
      setImageToEdit(galleryImages[0]);
      setIsEditing(true);
    }
  };

  const handleSaveEditedImage = (editedImage: string) => {
    setGalleryImages([editedImage]);
  };

  // Функция для обработки отправки данных
  const handleSubmit = () => {
    if (galleryImages[0]) { // Проверяем, что первое изображение не пустое
      onNext({ photo: galleryImages[0] }); // Вызываем функцию onNext с загруженной фотографией
    }
  };

  return (
    <Box style={{ padding: "20px" }}>
      <Typography variant="h5" align="center" sx={{ marginBottom: "20px" }}>
        Upload your photo
      </Typography>
      <Typography variant="h6" align="center" sx={{ marginBottom: "20px" }}>
        Make sure the photo of your face is clear so that it can be easily
        verified
      </Typography>

      {!isEditing && (
        <>
          <Gallery
            columns={1}
            rows={1}
            galleryImages={galleryImages}
            handleDeleteImage={() => setGalleryImages([""])}
            handleLoadImage={() => { }}
          />
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <Button variant="contained" component="label">
              Upload Photo
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            {galleryImages[0] && (
              <Button
                variant="outlined"
                sx={{ marginLeft: "10px" }}
                onClick={handleEditImage}
              >
                Edit Photo
              </Button>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "100%", marginTop: "20px" }}
            disabled={galleryImages[0] === ""}
            onClick={handleSubmit}
          >
            Next
          </Button>
        </>
      )}

      {isEditing && imageToEdit && (
        <PhotoEditor
          image={imageToEdit}
          onSave={handleSaveEditedImage}
          onClose={() => setIsEditing(false)}
        />
      )}
    </Box>
  );
};

export default PhotoStep; // Экспортируем компонент для использования в других частях приложения
