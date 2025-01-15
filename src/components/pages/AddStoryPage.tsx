import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PhotoEditor from "./PhotoEditor";
import { logEvent, logPageView } from "../../analytics";
import { createStory } from "../../api/stories";
import { dataURLtoFile } from "../../utils";
import { userData } from "../../stores/UserDataStore";

const AddStoryPage: React.FC = () => {
  const navigate = useNavigate();

  const currentUserISU = userData.getIsu();

  const [isEditing, setIsEditing] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    logPageView("/add-story");
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalFile(file); // Keep the original file if needed
      const reader = new FileReader();
      reader.onload = () => {
        setImageToEdit(reader.result as string);
        setIsEditing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    navigate("/chats");
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  /**
   * Called once the user hits "Save" on the PhotoEditor
   * or if you prefer, once they confirm they're ready
   * to post their story
   */
  const handleSave = async (editedImage: string) => {
    try {
      logEvent("Stories", "Save story", "");

      // Convert the edited base64 image back to a File
      const editedFile = dataURLtoFile(editedImage, originalFile?.name || "story.png");

      // Send the story to the backend
      await createStory(currentUserISU, editedFile);

      // If successful, show a success Snackbar and navigate away
      setSnackbar({
        open: true,
        message: "Story successfully uploaded!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/chats");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: `Failed to save the story: ${error.message}`,
          severity: "error",
        });
      } else {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to save the story: Unknown error",
          severity: "error",
        });
      }
    } finally {
      setIsEditing(false);
    }
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

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddStoryPage;
