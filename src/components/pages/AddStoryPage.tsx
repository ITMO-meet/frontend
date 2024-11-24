import React, { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FilerobotImageEditor, {
  TABS,
} from "react-filerobot-image-editor";


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
        <FilerobotImageEditor
          source={imageToEdit}
          onBeforeSave={() => false}

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onSave={(imageData) => {
            //console.log( imageData.imageBase64);
            alert("Image saved!");
            setIsEditing(false);
            navigate("/chats");
          }}

          onClose={() => setIsEditing(false)}
          annotationsCommon={{
            fill: "#ff0000",
          }}
          Text={{
            text: "Placeholder",
            fontFamily: "Tahoma",
            fontSize: 30,
          }}
          Rotate={{ angle: 90, componentType: 'slider' }}
          Crop={{
            ratio: "custom",
            presetsItems: [
              {
                titleKey: '4:3',
                ratio: 4 / 3,
              },
              {
                titleKey: '21:9',
                ratio: 21 / 9,
              },
            ],
          }}
          theme={{
            colors: {
              primaryBg: "#000",
              primary: "#1e90ff",
            },
          }}
          tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.FILTERS, TABS.FINETUNE, TABS.RESIZE]}
          savingPixelRatio={0} previewPixelRatio={0}
        />
      )}
    </Box>
  );
};

export default AddStoryPage;
