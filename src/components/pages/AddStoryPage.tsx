import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PhotoEditor from "./PhotoEditor";
import { logEvent, logPageView } from "../../analytics";


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
        setIsEditing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => { 
    logPageView("/add-story")
  }, [])

  const handleCancel = () => {
    navigate("/chats");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSave = (editedImage: string) => {
    //console.log( imageData.imageBase64);
    logEvent("Stories", "Save story", "")
    alert("Image saved!");
    setIsEditing(false);
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
              aria-label="file upload"
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
        <PhotoEditor
          image={imageToEdit}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </Box>
  );
};

export default AddStoryPage;
