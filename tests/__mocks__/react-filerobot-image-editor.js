import React from 'react';
import PropTypes from 'prop-types';

const MockedImageEditor = ({ onSave, onClose }) => {
    return (
        <div data-testid="filerobot-image-editor">
            <button onClick={() => onSave({ imageBase64: 'mockedImageBase64' })}>Save</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

MockedImageEditor.propTypes = {
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default MockedImageEditor;
export const TABS = {};
export const TOOLS = {};