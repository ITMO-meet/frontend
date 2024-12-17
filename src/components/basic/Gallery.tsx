// src/components/basic/Gallery.tsx

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton } from '@mui/material';
import React from 'react';

interface GalleryProps {
  galleryImages: (string | null)[]; // Updated to accept string or null
  handleDeleteImage: (index: number) => void;
  handleLoadImage: (index: number, url: string) => void;
  handleEditImage: (index: number) => void;
  columns: number; // Number of columns
  rows: number; // Number of rows
}

const Gallery: React.FC<GalleryProps> = ({
                                           galleryImages,
                                           handleDeleteImage,
                                           handleLoadImage,
                                           handleEditImage,
                                           columns,
                                           rows,
                                         }) => {
  const handleFileChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleLoadImage(index, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageSize = columns === 1 ? 360 : 120; // Adjust image size based on columns

  return (
      <Box mt={3} width="100%">
        <Box
            display="grid"
            gridTemplateColumns={`repeat(${columns}, 1fr)`}
            gap={1}
            justifyContent="center"
        >
          {galleryImages.slice(0, columns * rows).map((src, index) => (
              <Box
                  key={index}
                  position="relative"
                  width={`${imageSize}px`}
                  height={`${imageSize}px`}
                  bgcolor="grey.300"
              >
                {src && (
                    <Box
                        component="img"
                        src={src}
                        alt={`Gallery Image ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                    />
                )}
                {/* Delete Button */}
                {src && (
                    <IconButton
                        size="small"
                        onClick={() => handleDeleteImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          color: 'black',
                        }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                )}

                {/* Edit/Upload Button */}
                {!src ? (
                    <IconButton
                        size="small"
                        component="label"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          left: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          color: 'black',
                        }}
                    >
                      <EditIcon fontSize="small" />
                      <input
                          type="file"
                          accept="image/*"
                          hidden
                          data-testid={`file-input-${index}`} // Added for testing
                          onChange={(event) => handleFileChange(event, index)}
                      />
                    </IconButton>
                ) : (
                    <IconButton
                        size="small"
                        onClick={() => handleEditImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          left: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          color: 'black',
                        }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                )}
              </Box>
          ))}
        </Box>
      </Box>
  );
};

export default Gallery;
