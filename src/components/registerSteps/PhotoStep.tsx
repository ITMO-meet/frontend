// PhotoStep.tsx
import { Box, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import { uploadLogo } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';

import Gallery from '../basic/Gallery'; // Импортируем компонент галереи для отображения изображений
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки
import PhotoEditor from '../pages/PhotoEditor';


interface PhotoStepProps {
    isu: number;
    onNext: (data: { photo: File }) => void;
}

const PhotoStep: React.FC<PhotoStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<string[]>([""]); // Хук состояния для хранения изображений в галерее
    const [isEditing, setIsEditing] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!selectedFile) {
            showError('Please select a photo');
            return;
        }
        try {
            await uploadLogo(isu, selectedFile);
            onNext({ photo: selectedFile });
        } catch(e: any) {
            showError(e.message);
        }
    };


  const handleLoadImage = (index: number, url: string) => {
    const newGal = [...galleryImages];
    newGal[index] = url;
    setGalleryImages(newGal);
  };

  // Функция для удаления изображения по индексу
  const handleDeleteImage = (index: number) => {
    const newGal = [...galleryImages];
    newGal[index] = "";
    setGalleryImages(newGal);
  };


  const handleEditImage = (index: number) => {
    if (galleryImages[index]) {
      setImageToEdit(galleryImages[index]);
      setIsEditing(true);
    }
  };

  const handleSaveEditedImage = (editedImage: string) => {
    setGalleryImages([editedImage]);
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
            handleDeleteImage={handleDeleteImage}
            handleLoadImage={handleLoadImage}
            handleEditImage={handleEditImage}
          />
          <RoundButton
            sx={{ width: "100%", marginTop: "20px" }} // Стили для кнопки
            disabled={galleryImages[0] === ''} // Кнопка отключена, если первое изображение пустое
            onClick={handleSubmit}
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

export default PhotoStep; // Экспортируем компонент для использования в других частях приложения