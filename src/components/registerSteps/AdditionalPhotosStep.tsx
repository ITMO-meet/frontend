// AdditionalPhotosStep.tsx
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import Gallery from '../basic/Gallery';
import RoundButton from '../basic/RoundButton';

interface AdditionalPhotosStepProps {
  onNext: (data: { additionalPhotos: string[] }) => void;
}

const AdditionalPhotosStep: React.FC<AdditionalPhotosStepProps> = ({ onNext }) => {
  const [galleryImages, setGalleryImages] = useState<string[]>(["", "", "", "", "", ""]);

  const handleDeleteImage = (index: number) => {
    setGalleryImages((prev) => prev.map((p, i) => i !== index ? p : ""));
  };

  const handleEditImage = (index: number, url: string) => {
    const newGal = [...galleryImages];
    newGal[index] = url;
    setGalleryImages(newGal);
  };

  const handleSubmit = () => {
    if (galleryImages) {
      onNext({ additionalPhotos: galleryImages });
    }
  };

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>Add photo</Typography>
      <Typography variant="h6" align='center' sx={{ marginBottom: "20px" }}>At least one, but all six would be even better</Typography>
      <Gallery columns={3} rows={2} galleryImages={galleryImages} handleDeleteImage={handleDeleteImage} handleLoadImage={handleEditImage} />
      <RoundButton onClick={handleSubmit} sx={{ width: "100%", marginTop: "20px" }}>Next</RoundButton>
    </Box>
  );
};

export default AdditionalPhotosStep;
