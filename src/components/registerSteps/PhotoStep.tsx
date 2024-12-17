// src/components/registerSteps/PhotoStep.tsx

import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { uploadLogo } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';
import Gallery from '../basic/Gallery';
import RoundButton from '../basic/RoundButton';
import PhotoEditor from '../pages/PhotoEditor';

interface PhotoStepProps {
    isu: number;
    onNext: (data: { photo: File }) => void;
}

const PhotoStep: React.FC<PhotoStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [files, setFiles] = useState<(File | null)[]>([null]);
    const [galleryImages, setGalleryImages] = useState<(string | null)[]>([null]);
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
            showError('Please select a photo');
            return;
        }
        try {
            await uploadLogo(isu, filtered[0]);
            onNext({ photo: filtered[0] });
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (e: any) {
            showError(e.message);
        }
    };

    return (
        <Box style={{ padding: "20px" }}>
            <Typography variant="h5" align="center" sx={{ marginBottom: "20px" }}>
                Upload your photo
            </Typography>
            <Typography variant="h6" align="center" sx={{ marginBottom: "20px" }}>
                Make sure the photo of your face is clear so that it can be easily verified
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
                    <Box mb={1}>
                        <input
                            type="file"
                            accept="image/*"
                            data-testid="file-input-0" // Ensured data-testid is present
                            onChange={(e) => handleFileSelect(e, 0)}
                        />
                    </Box>
                    <RoundButton
                        sx={{ width: "100%", marginTop: "20px" }}
                        disabled={files[0] === null}
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

export default PhotoStep;
