// src/components/registerSteps/AdditionalPhotosStep.tsx

import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { uploadCarousel } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';
import Gallery from '../basic/Gallery';
import RoundButton from '../basic/RoundButton';
import PhotoEditor from '../pages/PhotoEditor';

interface AdditionalPhotosStepProps {
    isu: number;
    onNext: (data: { additionalPhotos: File[] }) => void;
}

const AdditionalPhotosStep: React.FC<AdditionalPhotosStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [files, setFiles] = useState<(File | null)[]>([null, null, null, null, null, null]);
    const [galleryImages, setGalleryImages] = useState<(string | null)[]>([null, null, null, null, null, null]);

    // State for editing
    const [isEditing, setIsEditing] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        const newFiles = [...files];
        newFiles[index] = selected;
        setFiles(newFiles);

        // Load image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const newGallery = [...galleryImages];
            newGallery[index] = reader.result as string;
            setGalleryImages(newGallery);
        };
        reader.readAsDataURL(selected);
    };

    const handleDeleteImage = (index: number) => {
        const newFiles = [...files];
        newFiles[index] = null;
        setFiles(newFiles);

        const newGallery = [...galleryImages];
        newGallery[index] = null;
        setGalleryImages(newGallery);
    };

    const handleLoadImage = (index: number, url: string) => {
        const newGallery = [...galleryImages];
        newGallery[index] = url;
        setGalleryImages(newGallery);
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
            const newGallery = [...galleryImages];
            newGallery[currentIndex] = editedImage;
            setGalleryImages(newGallery);
        }
    };

    const handleSubmit = async () => {
        const filtered = files.filter((f): f is File => f !== null);
        if (filtered.length === 0) {
            showError('Please select at least one photo');
            return;
        }
        try {
            await uploadCarousel(isu, filtered);
            onNext({ additionalPhotos: filtered });
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (e: any) {
            showError(e.message);
        }
    };

    return (
        <Box style={{ padding: '20px' }}>
            <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>Add additional photos</Typography>
            <Typography variant="h6" align='center' sx={{ marginBottom: "20px" }}>
                At least one, but all six would be even better
            </Typography>
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
                                data-testid={`file-input-${i}`} // Ensured data-testid is present
                                onChange={(e) => handleFileSelect(e, i)}
                            />
                        </Box>
                    ))}
                    <RoundButton
                        onClick={handleSubmit}
                        sx={{ width: "100%", marginTop: "20px" }}
                        disabled={files.filter((f): f is File => f !== null).length === 0}
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
