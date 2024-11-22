import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Slider,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CropIcon from "@mui/icons-material/Crop";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactCrop, { Crop, PixelCrop, centerCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";
import { Rnd } from "react-rnd";

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
  const displayedImgRef = useRef<HTMLImageElement | null>(null);
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

  const [isAddingText, setIsAddingText] = useState(false);
  const [isDeletingText, setIsDeletingText] = useState(false);
  const [textBoxes, setTextBoxes] = useState<any[]>([]);
  const [currentTextStyle, setCurrentTextStyle] = useState({
    fontSize: 24,
    color: "#000000",
  });
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(
    null
  );

  const standardColors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ];

  const handleCancel = () => {
    navigate("/chats");
  };

  const handleUpload = async () => {
    if (displayedImage) {
      const finalImageUrl = await generateFinalImage();

      window.open(finalImageUrl);

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
        setTextBoxes([]);
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

  const generateFinalImage = (): Promise<string> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = displayedImage;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          alert("Error generating image");
          return;
        }

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        const displayedImageElement = displayedImgRef.current;
        if (!displayedImageElement) {
          alert("Error generating image");
          return;
        }

        const displayedWidth = displayedImageElement.clientWidth;
        const displayedHeight = displayedImageElement.clientHeight;

        const scaleX = image.width / displayedWidth;
        const scaleY = image.height / displayedHeight;

        const imageRect = displayedImageElement.getBoundingClientRect();
        const containerRect =
          displayedImageElement.parentElement!.getBoundingClientRect();

        const offsetX = imageRect.left - containerRect.left;
        const offsetY = imageRect.top - containerRect.top;

        textBoxes.forEach((box) => {
          ctx.save();

          const x = (box.x - offsetX) * scaleX;
          const y = (box.y - offsetY) * scaleY;
          const width = box.width * scaleX;
          const height = box.height * scaleY;
          const fontSize = box.fontSize * ((scaleX + scaleY) / 2);

          ctx.translate(x + width / 2, y + height / 2);
          ctx.rotate((box.rotation * Math.PI) / 180);

          ctx.font = `${fontSize}px Arial`;
          ctx.fillStyle = box.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const lines = box.text.split("\n");
          const lineHeight = fontSize * 1.2;

          lines.forEach((line: string, index: number) => {
            ctx.fillText(
              line,
              0,
              (index - (lines.length - 1) / 2) * lineHeight,
              width
            );
          });

          ctx.restore();
        });

        const finalImageUrl = canvas.toDataURL("image/png");
        resolve(finalImageUrl);
      };
    });
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
    [completedCrop, scale, textBoxes]
  );

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
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
                  setIsAddingText(false);
                  setIsRotating(false);
                  setIsDeletingText(false);
                }}
              >
                <CropIcon fontSize="large" />
              </IconButton>
              <IconButton
                sx={{ color: "secondary.main" }}
                onClick={() => {
                  setIsRotating(true);
                  setIsCropping(false);
                  setIsAddingText(false);
                  setIsDeletingText(false);
                }}
              >
                <RotateLeftIcon fontSize="large" />
              </IconButton>
              <IconButton
                sx={{
                  color: isAddingText ? "primary.main" : "secondary.main",
                }}
                onClick={() => {
                  setIsAddingText(!isAddingText);
                  setIsDeletingText(false);
                  setIsCropping(false);
                  setIsRotating(false);
                }}
              >
                <TextFieldsIcon fontSize="large" />
              </IconButton>
              <IconButton
                sx={{
                  color: isDeletingText ? "primary.main" : "secondary.main",
                }}
                onClick={() => {
                  setIsDeletingText(!isDeletingText);
                  setIsAddingText(false);
                  setIsCropping(false);
                  setIsRotating(false);
                }}
              >
                <DeleteIcon fontSize="large" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          position: "relative",
          backgroundColor: "#f5f5f5",
          overflow: "hidden",
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={(e) => {
          if (isAddingText) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newTextBox = {
              id: Date.now().toString(),
              x: x - 100,
              y: y - 25,
              width: 200,
              height: 50,
              text: "Your Text Here",
              fontSize: currentTextStyle.fontSize,
              color: currentTextStyle.color,
              rotation: 0,
            };

            setTextBoxes([...textBoxes, newTextBox]);
            setSelectedTextBoxId(newTextBox.id);
            setIsAddingText(false);
          }
        }}
      >
        {displayedImage && !isCropping && !isRotating && (
          <img
            ref={displayedImgRef}
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

        {textBoxes.map((box) => (
          <Rnd
            key={box.id}
            position={{ x: box.x, y: box.y }}
            size={{ width: box.width, height: box.height }}
            onDragStop={(e, d) => {
              const updatedBoxes = textBoxes.map((tb) =>
                tb.id === box.id ? { ...tb, x: d.x, y: d.y } : tb
              );
              setTextBoxes(updatedBoxes);
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              const updatedBoxes = textBoxes.map((tb) =>
                tb.id === box.id
                  ? {
                    ...tb,
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    x: position.x,
                    y: position.y,
                  }
                  : tb
              );
              setTextBoxes(updatedBoxes);
            }}
            bounds="parent"
            enableResizing
            style={{
              border:
                selectedTextBoxId === box.id
                  ? "1px dashed #000"
                  : "1px solid transparent",
              position: "absolute",
            }}
            enableUserSelectHack={false}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              if (isDeletingText) {
                setTextBoxes(textBoxes.filter((tb) => tb.id !== box.id));
                setSelectedTextBoxId(null);
              } else {
                setSelectedTextBoxId(box.id);
              }
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `rotate(${box.rotation}deg)`,
                transformOrigin: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: box.fontSize,
                  color: box.color,
                  textAlign: "center",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                {box.text}
              </div>
            </div>
          </Rnd>
        ))}

        <canvas ref={previewCanvasRef} style={{ display: "none" }} />
      </Box>

      {selectedTextBoxId && (
        <Box
          sx={{
            padding: "16px",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "8px",
            marginTop: "16px",
          }}
        >
          <Typography variant="subtitle1">Text Styling</Typography>

          <TextField
            label="Edit Text"
            variant="outlined"
            fullWidth
            value={
              textBoxes.find((tb) => tb.id === selectedTextBoxId)?.text || ""
            }
            onChange={(e) => {
              const updatedBoxes = textBoxes.map((tb) =>
                tb.id === selectedTextBoxId
                  ? { ...tb, text: e.target.value }
                  : tb
              );
              setTextBoxes(updatedBoxes);
            }}
            sx={{ mt: 2 }}
          />

          <Slider
            value={
              textBoxes.find((tb) => tb.id === selectedTextBoxId)?.fontSize ||
              24
            }
            onChange={(e, newValue) => {
              const updatedBoxes = textBoxes.map((tb) =>
                tb.id === selectedTextBoxId
                  ? { ...tb, fontSize: newValue as number }
                  : tb
              );
              setTextBoxes(updatedBoxes);
            }}
            aria-labelledby="font-size-slider"
            step={1}
            min={10}
            max={100}
            sx={{ mt: 2, width: "80%" }}
          />

          <Box sx={{ display: "flex", mt: 2 }}>
            {standardColors.map((color) => (
              <Box
                key={color}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: color,
                  borderRadius: "50%",
                  marginRight: 1,
                  border: color === "#FFFFFF" ? "1px solid #ccc" : "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const updatedBoxes = textBoxes.map((tb) =>
                    tb.id === selectedTextBoxId
                      ? { ...tb, color: color }
                      : tb
                  );
                  setTextBoxes(updatedBoxes);
                }}
              />
            ))}
          </Box>

          <Slider
            value={
              textBoxes.find((tb) => tb.id === selectedTextBoxId)?.rotation || 0
            }
            onChange={(e, newValue) => {
              const updatedBoxes = textBoxes.map((tb) =>
                tb.id === selectedTextBoxId
                  ? { ...tb, rotation: newValue as number }
                  : tb
              );
              setTextBoxes(updatedBoxes);
            }}
            aria-labelledby="rotation-slider"
            step={1}
            min={-180}
            max={180}
            sx={{ mt: 2, width: "80%" }}
          />

          <Button
            variant="contained"
            color="secondary"
            onClick={() => setSelectedTextBoxId(null)}
            sx={{ mt: 2 }}
          >
            Done
          </Button>
        </Box>
      )}

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
