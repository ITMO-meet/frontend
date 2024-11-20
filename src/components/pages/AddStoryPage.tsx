import React, { useRef, useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const AddStoryPage: React.FC = () => {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);

    const handleCancel = () => {
        navigate('/chats');
    };

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
                position: "relative",
                height: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Add a Story
                </Typography>
                <IconButton component="label" sx={{ color: "primary.main" }}>
                    <FileUploadIcon fontSize="large" />
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                    />
                </IconButton>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: '20px',
                    borderRadius: '12px',
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        border: "1px solid #ccc",
                        maxWidth: "100%",
                        maxHeight: "80vh",
                    }}
                ></canvas>
            </Box>

            <Box
                sx={{
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleUpload}>
                    Upload
                </Button>
            </Box>
        </Box>
    );
};

export default AddStoryPage;
