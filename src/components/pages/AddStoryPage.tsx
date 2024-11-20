import React, { useRef, useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CropIcon from "@mui/icons-material/Crop";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const AddStoryPage: React.FC = () => {
  const navigate = useNavigate();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [upImg, setUpImg] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const [aspect, setAspect] = useState<number | undefined>(1);

  const [isCropping, setIsCropping] = useState(false);

  const handleCancel = () => {
    navigate("/chats");
  };

  const handleUpload = () => {
    if (croppedImageUrl || upImg) {
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
        setUpImg(reader.result as string);
        setCroppedImageUrl("");
        setIsCropping(false);
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect || 1));
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );

        const canvas = previewCanvasRef.current;
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setCroppedImageUrl(url);
          }
        });
      }
    },
    100,
    [completedCrop, scale, rotate]
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
          {upImg && (
            <IconButton
              sx={{ color: "secondary.main" }}
              onClick={() => {
                setIsCropping(true);
              }}
            >
              <CropIcon fontSize="large" />
            </IconButton>
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
        }}
      >
        {upImg && !isCropping && !croppedImageUrl && (
          <img
            src={upImg}
            alt="Uploaded"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        )}

        {isCropping && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={upImg}
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}

        {croppedImageUrl && !isCropping && (
          <img
            alt="Cropped"
            src={croppedImageUrl}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsCropping(false)}
          >
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
