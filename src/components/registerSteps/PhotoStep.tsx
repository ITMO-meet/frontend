// PhotoStep.tsx
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import Gallery from '../basic/Gallery';
import RoundButton from '../basic/RoundButton';

interface PhotoStepProps {
  onNext: (data: { photo: string }) => void;
}

const PhotoStep: React.FC<PhotoStepProps> = ({ onNext }) => {
  const [galleryImages, setGalleryImages] = useState<string[]>([""]);

  const handleDeleteImage = (index: number) => {
    setGalleryImages((prev) => prev.map((p, i) => i !== index ? p : ""));
  };

  const handleEditImage = (index: number, url: string) => {
    const newGal = [...galleryImages];
    newGal[index] = url;
    setGalleryImages(newGal);
  };

  const handleSubmit = () => {
    if (galleryImages[0]) {
      onNext({ photo: galleryImages[0] });
    }
  };

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>Upload your photo</Typography>
      <Typography variant="h6" align='center' sx={{ marginBottom: "20px" }}>Make sure the photo of your face is clear so that it can be easily verified</Typography>
      <Gallery columns={1} rows={1} galleryImages={galleryImages} handleDeleteImage={handleDeleteImage} handleLoadImage={handleEditImage} />
      <RoundButton onClick={handleSubmit} disabled={galleryImages[0] === ''} sx={{ width: "100%", marginTop: "20px" }}>Next</RoundButton>
    </Box>
  );
};

export default PhotoStep;
