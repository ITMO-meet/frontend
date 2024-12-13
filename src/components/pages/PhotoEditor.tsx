import React from "react";
import FilerobotImageEditor, { TABS } from "react-filerobot-image-editor";
import { Box, Typography } from '@mui/material'; // Импортируем компоненты из MUI


interface PhotoEditorProps {
    image: string;
    onSave: (editedImage: string) => void;
    onClose: () => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ image, onSave, onClose }) => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 1300,
            }}
        >
            <FilerobotImageEditor
                source={image}
                savingPixelRatio={1}
                previewPixelRatio={1}
                onBeforeSave={() => false}
                onSave={(ImageData) => {
                    if (ImageData.imageBase64) {
                        onSave(ImageData.imageBase64);
                    }
                    onClose();
                }}
                onClose={onClose}
                annotationsCommon={{
                    fill: "#ff0000",
                }}
                Text={{
                    text: "Placeholder",
                    fontFamily: "Tahoma",
                    fontSize: 28,
                }}
                Rotate={{ angle: 90, componentType: "slider" }}
                Crop={{
                    ratio: "custom",
                    presetsItems: [
                        {
                            titleKey: "4:3",
                            ratio: 4 / 3,
                        },
                        {
                            titleKey: "21:9",
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
                tabsIds={[
                    TABS.ADJUST,
                    TABS.ANNOTATE,
                    TABS.FILTERS,
                    TABS.FINETUNE,
                    TABS.RESIZE,
                ]}
            />
        </Box>
    );
};

export default PhotoEditor;