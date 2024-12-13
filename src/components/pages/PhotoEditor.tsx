import React from "react";
import FilerobotImageEditor, { TABS } from "react-filerobot-image-editor";

interface PhotoEditorProps {
    image: string;
    onSave: (editedImage: string) => void;
    onClose: () => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ image, onSave, onClose }) => {
    return (
        <FilerobotImageEditor
            source={image}
            onSave={(ImageData) => {
                onSave(ImageData.imageBase64);
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
    );
};

export default PhotoEditor;