import React, { useRef, useState } from "react";
import { Box, Typography, Button, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";



const AddStoryPage: React.FC = () => {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);

    const handleCancel = () => {
        navigate('/chats');
    }

    const handleUpload = () => {
        if (uploadedImage) {
            alert('Story uploaded successfully!');
            navigate('/chats');
        } else {
            alert('Please upload an image first!');
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    setUploadedImage(img);
                    drawImageOnCanvas(img);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const drawImageOnCanvas = (img: HTMLImageElement) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, img.width, img.height);
            }
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                padding: 2,
                textAlign: "center",
            }}
        >
            <Typography variant="h4" sx={{ mb: 4 }}>
                Add a Story
            </Typography>

            <TextField
                type="file"
                inputProps={{ accept: "image/*" }}
                sx={{ mb: 4 }}
                onChange={handleFileChange}
            />

            <canvas
                ref={canvasRef}
                style={{
                    border: "1px solid #ccc",
                    maxWidth: "100%",
                    marginBottom: "20px",
                }}
            ></canvas>

            <Box display="flex" gap={2}>
                <Button variant="contained" color="primary" onClick={handleUpload}>
                    Upload
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default AddStoryPage;