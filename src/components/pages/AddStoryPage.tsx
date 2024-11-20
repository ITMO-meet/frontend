import React, { useRef, useState } from "react";
import { Box, Typography, IconButton, Button, Slider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CropIcon from "@mui/icons-material/Crop";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import ReactCrop, { Crop, PixelCrop, centerCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

function centerInitialCrop(mediaWidth: number, mediaHeight: number): Crop {
  return centerCrop(
    {
      unit: "%",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    mediaWidth,
    mediaHeight
  );
}

const AddStoryPage: React.FC = () => {
  const navigate = useNavigate();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [upImg, setUpImg] = useState<string>("");
  const [displayedImage, setDisplayedImage] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [scale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const [isCropping, setIsCropping] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const handleCancel = () => {
    navigate("/chats");
  };

  const handleUpload = () => {
    if (displayedImage) {
      alert("Story uploaded successfully!");
      navigate("/chats");
    } else {
      alert("Please upload an image first!");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const imgSrc = reader.result as string;
        setUpImg(imgSrc);
        setDisplayedImage(imgSrc);
        setCroppedImageUrl("");
        setIsCropping(false);
        setCrop(undefined);
        setRotate(0);
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerInitialCrop(width, height));
  };

  const getRotatedImage = (
    imageSrc: string,
    rotation: number
  ): Promise<string> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const angleInRadians = (rotation * Math.PI) / 180;

        const sin = Math.abs(Math.sin(angleInRadians));
        const cos = Math.abs(Math.cos(angleInRadians));
        const width = image.width;
        const height = image.height;
        const newWidth = width * cos + height * sin;
        const newHeight = width * sin + height * cos;
        canvas.width = newWidth;
        canvas.height = newHeight;

        if (ctx) {
          ctx.translate(newWidth / 2, newHeight / 2);
          ctx.rotate(angleInRadians);
          ctx.drawImage(image, -width / 2, -height / 2);
          resolve(canvas.toDataURL());
        }
      };
    });
  };

  const applyRotation = async () => {
    if (rotate !== 0) {
      const rotatedImgSrc = await getRotatedImage(displayedImage, rotate);
      setDisplayedImage(rotatedImgSrc);
      setRotate(0);
    }
    setIsRotating(false);
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        await canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          0
        );

        const canvas = previewCanvasRef.current;
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setCroppedImageUrl((prevUrl) => {
              if (prevUrl) {
                URL.revokeObjectURL(prevUrl);
              }
              return url;
            });
          }
        }, "image/png");
      }
    },
    100,
    [completedCrop, scale]
  );

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
          {displayedImage && (
            <>
              <IconButton
                sx={{ color: "secondary.main" }}
                onClick={async () => {
                  if (rotate !== 0) {
                    await applyRotation();
                  }
                  setIsCropping(true);
                }}
              >
                <CropIcon fontSize="large" />
              </IconButton>
              <IconButton
                sx={{ color: "secondary.main" }}
                onClick={() => {
                  setIsRotating(true);
                }}
              >
                <RotateLeftIcon fontSize="large" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          backgroundColor: "#f5f5f5",
          overflow: "hidden",
          padding: "16px",
        }}
      >
        {displayedImage && !isCropping && !isRotating && (
          <img
            src={displayedImage}
            alt="Uploaded"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "16px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              border: "2px solid #ddd",
            }}
          />
        )}

        {isCropping && (
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={displayedImage}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "16px",
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}

        {isRotating && (
          <Box sx={{ textAlign: "center" }}>
            <img
              ref={imgRef}
              alt="Rotate me"
              src={displayedImage}
              style={{
                maxWidth: "90%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: "16px",
                transform: `rotate(${rotate}deg)`,
                transition: "transform 0.1s linear",
              }}
            />
            <Slider
              value={rotate}
              onChange={(e, newValue) => setRotate(newValue as number)}
              aria-labelledby="rotation-slider"
              step={1}
              min={-180}
              max={180}
              sx={{ mt: 2, width: "80%" }}
            />
            <Button variant="contained" color="primary" onClick={applyRotation}>
              Accept
            </Button>
          </Box>
        )}

        <canvas ref={previewCanvasRef} style={{ display: "none" }} />
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsCropping(false);
              if (croppedImageUrl) {
                setDisplayedImage(croppedImageUrl);
                setUpImg(croppedImageUrl);
                setCrop(undefined);
              }
            }}
          >
            Accept
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
