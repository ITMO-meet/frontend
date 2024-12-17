// AdditionalPhotosStep.tsx
import { Box, Typography, Button } from '@mui/material';// Импортируем необходимые компоненты из MUI
import { uploadCarousel } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';


 
import React, { useState } from 'react'; // Импортируем React и хук useState
import Gallery from '../basic/Gallery'; // Импортируем компонент галереи
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки
import PhotoEditor from '../pages/PhotoEditor';


interface AdditionalPhotosStepProps {
    isu: number;
    onNext: (data: { additionalPhotos: File[] }) => void;
}


const AdditionalPhotosStep: React.FC<AdditionalPhotosStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [galleryImages, setGalleryImages] = useState<(File | null)[]>([null,null,null,null,null,null]);

  // Хук состояния для хранения URL изображений в галерее
  const [isEditing, setIsEditing] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const f = e.target.files?.[0] || null;
        setFiles((prev) => {
            const copy = [...prev];
            copy[index] = f;
            return copy;
        });
    };
  
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const newFiles = [...files];
    newFiles[index] = selected;
    setFiles(newFiles);


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
const handleSubmit = async () => {
        const filtered = files.filter((f): f is File => f instanceof File);
        if (filtered.length === 0) {
            showError('Please select at least one photo');
            return;
        }
        try {
            await uploadCarousel(isu, filtered);
            onNext({ additionalPhotos: filtered });
        } catch(e: any) {
            showError(e.message);
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
          {files.map((_, i) => (
            <Box key={i} mb={1}>
              <input
                type="file"
                accept="image/*"
                data-testid={`file-input-${i}`}
                onChange={(e) => handleFileSelect(e, i)}
              />
            </Box>
          ))}
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

export default AdditionalPhotosStep;
