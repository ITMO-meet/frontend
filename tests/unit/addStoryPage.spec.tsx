import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logPageView } from '../../src/analytics'

jest.mock('../../src/analytics', () => ({
    logPageView: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('react-filerobot-image-editor', () => {
    const MockedImageEditor = ({ onSave, onClose }: { onSave: (data: { imageBase64: string }) => void; onClose: () => void }) => (
        <div data-testid="filerobot-image-editor">
            <button onClick={() => onSave({ imageBase64: 'mockedImageBase64' })}>Save</button>
            <button onClick={onClose}>Close Editor</button>
        </div>
    );
    MockedImageEditor.displayName = 'MockedImageEditor';

    const TABS = {
        ADJUST: 'adjust',
        ANNOTATE: 'annotate',
        FILTERS: 'filters',
        FINETUNE: 'finetune',
        RESIZE: 'resize',
    };

    return { __esModule: true, default: MockedImageEditor, TABS };
});

import AddStoryPage from '../../src/components/pages/AddStoryPage';

describe('AddStoryPage', () => {
    const mockedNavigate = jest.fn();

    beforeAll(() => {
        window.alert = jest.fn();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigate as jest.Mock).mockReturnValue(mockedNavigate);
    });

    test('renders AddStoryPage with initial elements', () => {
        render(
            <MemoryRouter>
                <AddStoryPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Add a Story')).toBeInTheDocument();

        expect(screen.getByLabelText(/file upload/i)).toBeInTheDocument();

        expect(screen.getByText('Cancel')).toBeInTheDocument();

        expect(logPageView).toHaveBeenCalledWith('/add-story');
    });

    test('uploads and previews an image', async () => {
        render(
            <MemoryRouter>
                <AddStoryPage />
            </MemoryRouter>
        );

        const file = new File(['dummy content'], 'story.png', { type: 'image/png' });

        const uploadInput = screen.getByLabelText(/file upload/i) as HTMLInputElement;
        expect(uploadInput).toBeInTheDocument();

        fireEvent.change(uploadInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByAltText('To edit')).toBeInTheDocument();
        });

        const img = screen.getByAltText('To edit') as HTMLImageElement;
        expect(img.src).toContain('data:image/png;base64');
    });

    test('opens image editor after clicking "Edit Image" button', async () => {
        render(
            <MemoryRouter>
                <AddStoryPage />
            </MemoryRouter>
        );

        const file = new File(['dummy content'], 'story.png', { type: 'image/png' });

        const uploadInput = screen.getByLabelText(/file upload/i) as HTMLInputElement;
        fireEvent.change(uploadInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByAltText('To edit')).toBeInTheDocument();
        });

        const editButton = screen.getByText('Edit Image');
        fireEvent.click(editButton);

        expect(screen.getByTestId('filerobot-image-editor')).toBeInTheDocument();
    });

    test('cancels editing and navigates back to /chats', async () => {
        render(
            <MemoryRouter>
                <AddStoryPage />
            </MemoryRouter>
        );

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(mockedNavigate).toHaveBeenCalledWith('/chats');
    });

    test('saves edited image and navigates to /chats', async () => {
        render(
            <MemoryRouter>
                <AddStoryPage />
            </MemoryRouter>
        );

        const file = new File(['dummy content'], 'story.png', { type: 'image/png' });

        const uploadInput = screen.getByLabelText(/file upload/i) as HTMLInputElement;
        fireEvent.change(uploadInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByAltText('To edit')).toBeInTheDocument();
        });

        const editButton = screen.getByText('Edit Image');
        fireEvent.click(editButton);

        expect(screen.getByTestId('filerobot-image-editor')).toBeInTheDocument();

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Image saved!');
            expect(mockedNavigate).toHaveBeenCalledWith('/chats');
        });
    });

    test('closes image editor without saving', async () => {
        render(
            <MemoryRouter>
                <AddStoryPage />
            </MemoryRouter>
        );

        const file = new File(['dummy content'], 'story.png', { type: 'image/png' });

        const uploadInput = screen.getByLabelText(/file upload/i) as HTMLInputElement;
        fireEvent.change(uploadInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByAltText('To edit')).toBeInTheDocument();
        });

        const editButton = screen.getByText('Edit Image');
        fireEvent.click(editButton);

        expect(screen.getByTestId('filerobot-image-editor')).toBeInTheDocument();

        const closeEditorButton = screen.getByText('Close Editor');
        fireEvent.click(closeEditorButton);

        await waitFor(() => {
            expect(screen.queryByTestId('filerobot-image-editor')).not.toBeInTheDocument();
        });
    });
});

beforeAll(() => {
    window.alert = jest.fn();
});
