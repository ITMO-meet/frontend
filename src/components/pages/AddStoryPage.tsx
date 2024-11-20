import React, { useRef, useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CropIcon from "@mui/icons-material/Crop";

const AddStoryPage: React.FC = () => {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isCropping, setIsCropping] = useState(false);

    const [cropBox, setCropBox] = useState({
        top: 50,
        left: 50,
        width: 200,
        height: 200,
    });

    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<string | null>(null);

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


    const applyCrop = () => {
        if (uploadedImage) {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (canvas && container) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    const scaleX = uploadedImage.width / container.offsetWidth;
                    const scaleY = uploadedImage.height / container.offsetHeight;

                    const cropX = cropBox.left * scaleX;
                    const cropY = cropBox.top * scaleY;
                    const cropWidth = cropBox.width * scaleX;
                    const cropHeight = cropBox.height * scaleY;

                    canvas.width = cropWidth;
                    canvas.height = cropHeight;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(
                        uploadedImage,
                        cropX,
                        cropY,
                        cropWidth,
                        cropHeight,
                        0,
                        0,
                        cropWidth,
                        cropHeight
                    );

                    setIsCropping(false);
                }
            }
        }
    };

    const startResizing = (direction: string) => {
        setIsResizing(true);
        setResizeDirection(direction);
    };

    const stopResizing = () => {
        setIsResizing(false);
        setResizeDirection(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isResizing) {
            const container = containerRef.current;
            if (container) {
                const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = container;
                let newCropBox = { ...cropBox };

                switch (resizeDirection) {
                    case "right":
                        newCropBox.width = Math.min(
                            e.clientX - offsetLeft - cropBox.left,
                            offsetWidth - cropBox.left
                        );
                        break;
                    case "bottom":
                        newCropBox.height = Math.min(
                            e.clientY - offsetTop - cropBox.top,
                            offsetHeight - cropBox.top
                        );
                        break;
                    case "left":
                        newCropBox.width = cropBox.width + (cropBox.left - (e.clientX - offsetLeft));
                        newCropBox.left = Math.max(e.clientX - offsetLeft, 0);
                        break;
                    case "top":
                        newCropBox.height = cropBox.height + (cropBox.top - (e.clientY - offsetTop));
                        newCropBox.top = Math.max(e.clientY - offsetTop, 0);
                        break;
                }

                setCropBox(newCropBox);
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
            onMouseMove={handleMouseMove}
            onMouseUp={stopResizing}
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
                    zIndex: 10,
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Add a Story
                </Typography>
                <Box>
                    <IconButton component="label" sx={{ color: "primary.main" }}>
                        <FileUploadIcon fontSize="large" />
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                    </IconButton>
                    <IconButton
                        sx={{ color: "secondary.main" }}
                        onClick={() => setIsCropping(!isCropping)}
                    >
                        <CropIcon fontSize="large" />
                    </IconButton>
                </Box>
            </Box>

            <Box
                ref={containerRef}
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: 'relative',
                    backgroundColor: '#f5f5f5',
                    overflow: 'hidden',
                }}
            >
                {uploadedImage && (
                    <img
                        src={uploadedImage.src}
                        alt="Uploaded"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                        }}
                    />
                )}

                {isCropping && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: `${cropBox.top}px`,
                            left: `${cropBox.left}px`,
                            width: `${cropBox.width}px`,
                            height: `${cropBox.height}px`,
                            border: "2px dashed black",
                            cursor: "move",
                        }}
                    >
                        <Box
                            onMouseDown={() => startResizing("top")}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                width: "10px",
                                height: "10px",
                                backgroundColor: "white",
                                border: "1px solid black",
                                transform: "translate(-50%, -50%)",
                                cursor: "ns-resize",
                            }}
                        />
                        <Box
                            onMouseDown={() => startResizing("bottom")}
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: "50%",
                                width: "10px",
                                height: "10px",
                                backgroundColor: "white",
                                border: "1px solid black",
                                transform: "translate(-50%, 50%)",
                                cursor: "ns-resize",
                            }}
                        />
                        <Box
                            onMouseDown={() => startResizing("left")}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: 0,
                                width: "10px",
                                height: "10px",
                                backgroundColor: "white",
                                border: "1px solid black",
                                transform: "translate(-50%, -50%)",
                                cursor: "ew-resize",
                            }}
                        />
                        <Box
                            onMouseDown={() => startResizing("right")}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                right: 0,
                                width: "10px",
                                height: "10px",
                                backgroundColor: "white",
                                border: "1px solid black",
                                transform: "translate(50%, -50%)",
                                cursor: "ew-resize",
                            }}
                        />
                    </Box>
                )}
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
                {isCropping && (
                    <Button variant="contained" color="primary" onClick={applyCrop}>
                        Apply Crop
                    </Button>
                )}
                <Button variant="contained" color="primary" onClick={handleUpload}>
                    Upload
                </Button>
            </Box>
        </Box>
    );
};

export default AddStoryPage;