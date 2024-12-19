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

    // New handler to receive both File and URL from Gallery
    const handleFileSelect = (index: number, file: File, url: string) => {
        const newFiles = [...files];
        newFiles[index] = file;
        setFiles(newFiles);

        const newGallery = [...galleryImages];
        newGallery[index] = url;
        setGalleryImages(newGallery);
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
        const selectedFile = files[0];
        if (!selectedFile) {
            showError('Please select a photo');
            return;
        }
        try {
            await uploadLogo(isu, selectedFile);
            onNext({ photo: selectedFile });
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
                        handleFileSelect={handleFileSelect} // Pass the new handler
                    />
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
