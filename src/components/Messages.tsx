import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  List,
  Paper,
  Modal,
  Grid,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import AttachmentIcon from '@mui/icons-material/Attachment';
import ImageIcon from '@mui/icons-material/Image';
import FolderIcon from '@mui/icons-material/Folder';
import StopIcon from '@mui/icons-material/Stop';
import UserMessage from './UserMessage';
import PageWrapper from '../PageWrapper';
import { MessageType, RawMessage } from '../types';
import { Profile } from '../api/profile';

interface MessagesProps {
  people: Profile[];
  messages: RawMessage[];
}

const Messages: React.FC<MessagesProps> = ({ people, messages }) => {
  const [chatMessages, setChatMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const contact = people.find((person) => person.isu === Number(id));


  // Audio recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Video recorder state
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (contact) {
      const initialMessages: MessageType[] = messages
        .filter(
          (message) =>
            message.sender_id === contact.isu || message.receiver_id === contact.isu
        )
        .map((message) => ({
          sender: message.sender_id === contact.isu ? 'them' : 'me',
          text: message.text,
          image: undefined, // или инициализация blob, если нужно
          video: undefined,
          audio: undefined,
          file: undefined,
        }));
      setChatMessages(initialMessages);
    }
  }, [contact, messages]);
  

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendText = () => {
    if (inputValue.trim() !== '') {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'me', text: inputValue }
      ]);
      setInputValue('');
      scrollToBottom();
    }
  };
  

  const handleOpenPicker = () => setIsPickerOpen(true);
  const handleClosePicker = () => setIsPickerOpen(false);

  const handleOpenGallery = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  const handleOpenFileManager = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
    
      if (isImage) {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'me', text: 'Image sent', image: file }
        ]);
      } else if (isVideo) {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'me', text: 'Video sent', video: file }
        ]);
      }
      scrollToBottom();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setChatMessages((prev) => [
        ...prev,
        { sender: 'me', text: file.name, file }
      ]);
      scrollToBottom();
    }
  };
  

  const startRecordingAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
  
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setChatMessages((prev) => [...prev, { sender: 'me', text: 'Voice message', audio: blob }]);
      stream.getTracks().forEach((track) => track.stop());
    };
    
  
    setMediaRecorder(recorder);
    recorder.start();
    setIsRecording(true);
  };
  

  const stopRecordingAudio = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleMicMouseDown = () => startRecordingAudio();
  const handleMicMouseUp = () => stopRecordingAudio();

  const startRecordingVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setChatMessages((prev) => [...prev, { sender: 'me', text: 'Video sent', video: blob, image: new Blob() }]);
      stream.getTracks().forEach((track) => track.stop());
    };

    setVideoStream(stream);
    setIsRecordingVideo(true);
    recorder.start();
  };

  const stopRecordingVideo = () => {
    if (isRecordingVideo && videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setIsRecordingVideo(false);
    }
  };

  return (
    <Box sx={{ pb: 7 }}>
      {/* Hidden Inputs */}
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        data-testid="gallery-input"
        style={{ display: 'none' }}
        onChange={handleGalleryChange}
      />
      <input
        type="file"
        ref={fileInputRef}
        data-testid="file-input"
        style={{ display: 'none' }}
        onChange={handleFileChange} // Use the newly defined function
      />


      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1,
          backgroundColor: '#fff',
        }}
      >
        <IconButton onClick={() => navigate(-1)} data-testid="back-button">
          <ArrowBackIosIcon />
        </IconButton>
        <Box
          onClick={() => navigate(`/user-profile/${contact?.isu}`)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            cursor: 'pointer',
            ml: 1,
          }}
        >
          <Avatar src={contact?.logo} sx={{ width: 40, height: 40, mx: 1 }} />
          <Typography variant="h6">{contact?.username}</Typography>
        </Box>
      </Paper>


      {/* Messages */}
      <PageWrapper direction={1}>
        <List
          sx={{
            mt: 8,
            mb: 2,
            px: 2,
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 200px)',
          }}
        >
          {chatMessages.map((message, index) => (
            <UserMessage key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </List>
      </PageWrapper>

      {/* Input */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          width: '100%',
          px: 2,
          bgcolor: '#fff',
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          InputProps={{
            startAdornment: ( 
              <InputAdornment position="start">
                <IconButton onClick={handleOpenPicker} data-testid="attachment-button">
                  <AttachmentIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSendText}>
                  <SendIcon />
                </IconButton>
                <IconButton onMouseDown={handleMicMouseDown} onMouseUp={handleMicMouseUp}>
                  <MicIcon />
                </IconButton>
                <IconButton
                  onClick={isRecordingVideo ? stopRecordingVideo : startRecordingVideo}
                >
                  {isRecordingVideo ? <StopIcon /> : <VideocamIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>


      {/* Picker Modal */}
      <Modal
          open={isPickerOpen}
          onClose={handleClosePicker}
          aria-labelledby="picker-modal-title" // Add accessible label
          role="dialog" // Explicitly define the role
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              width: '90%',
              maxWidth: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 3,
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography
              id="picker-modal-title" // Match the aria-labelledby
              variant="h6"
              sx={{ mb: 3, fontWeight: 'bold' }}
            >
              Select an Option
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid item>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f9f9f9',
                    borderRadius: '50%',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                  onClick={handleOpenGallery}
                >
                  <ImageIcon sx={{ fontSize: 40, color: '#616161' }} />
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Gallery
                </Typography>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f9f9f9',
                    borderRadius: '50%',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                  onClick={handleOpenFileManager}
                >
                  <FolderIcon sx={{ fontSize: 40, color: '#616161' }} />
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  File
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Modal>


    </Box>
  );
};

export default Messages;
