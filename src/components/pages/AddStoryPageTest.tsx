import React, { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FilerobotImageEditor from "react-filerobot-image-editor";

const AddStoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToEdit(reader.result as string);
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (editedImageUrl: string) => {
    setImageToEdit(editedImageUrl);
    setIsEditing(false);
    alert("Image saved successfully!");
  };

  const handleCancel = () => {
    navigate("/chats");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: "16px",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "16px" }}>
        Add a Story
      </Typography>

      {!isEditing && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton component="label" sx={{ color: "primary.main", marginBottom: "16px" }}>
            <FileUploadIcon fontSize="large" />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </IconButton>

          {imageToEdit && (
            <img
              src={imageToEdit}
              alt="To edit"
              style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }}
            />
          )}

          <Box sx={{ display: "flex", marginTop: "16px" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancel}
              sx={{ marginRight: "8px" }}
            >
              Cancel
            </Button>
            {imageToEdit && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Image
              </Button>
            )}
          </Box>
        </Box>
      )}

      {isEditing && imageToEdit && (
        <FilerobotImageEditor
          source={imageToEdit}
          onSave={({ base64 }) => handleSave(base64)}
          onClose={() => setIsEditing(false)}
          annotationsCommon={{
            fill: "#ff0000",
          }}
          Text={{ text: "Your text here" }}
          Rotate={{ angle: 0 }}
          Crop={{ aspectRatio: 1 }}
          theme={{
            colors: {
              primaryBg: "#000",
              primary: "#1e90ff",
            },
          }}
        />
      )}
    </Box>
  );
};

export default AddStoryPage;
