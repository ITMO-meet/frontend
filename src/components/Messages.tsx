import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  List,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import StopIcon from '@mui/icons-material/Stop';
import { useParams, useNavigate } from 'react-router-dom';
import UserMessage from './UserMessage';
import PageWrapper from '../PageWrapper';
import { MessageType, RawMessage } from '../types';
import { Profile } from '../api/profile'

interface MessagesProps {
  people: Profile[];
  messages: RawMessage[];
}

const Messages: React.FC<MessagesProps> = ({ people, messages }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contact = people.find((person) => person.isu === Number(id));

  const [chatMessages, setChatMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Audio recorder state
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Video recorder state
  const [videoRecorder, setVideoRecorder] = useState<MediaRecorder | null>(null);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (contact) {
      const initialMessages: MessageType[] = messages
        .filter(
          (message) =>
            message.sender_id === contact.isu || message.receiver_id === contact.isu
        )
        .map((message) => ({
          sender: message.sender_id === contact.isu ? 'them' : 'me' as const,
          text: message.text,
        }));
      setChatMessages(initialMessages);
    }
  }, [contact, messages]);

  const handleSendText = () => {
    if (inputValue.trim() !== '') {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'me', text: inputValue },
      ]);
      setInputValue('');
      scrollToBottom();
      // TODO: Implement actual message sending logic
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendText();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMessages]);

  /**
   * AUDIO RECORDING LOGIC
   */
  const startRecordingAudio = async () => {
    try {
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/ogg;codecs=opus';

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType });
      setMediaRecorder(recorder);

      const localChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        localChunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(localChunks, { type: mimeType });
        setChatMessages((prev) => [
          ...prev,
          { sender: 'me', text: '', audio: blob },
        ]);
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
        scrollToBottom();
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone: ', error);
      // TODO: show error to user
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Handlers for mic button (mouse and touch)
  const handleMicMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startRecordingAudio();
  };

  const handleMicMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    stopRecordingAudio();
  };

  const handleMicMouseLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRecordingAudio();
    }
  };

  const handleMicTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startRecordingAudio();
  };

  const handleMicTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    stopRecordingAudio();
  };

  /**
   * VIDEO RECORDING LOGIC
   */
  const startRecordingVideo = async () => {
    try {
      // Decide on a common video MIME type
      let mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        // Fallback if needed
        mimeType = 'video/mp4';
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setVideoStream(stream);

      const recorder = new MediaRecorder(stream, { mimeType });
      setVideoRecorder(recorder);

      const localChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        localChunks.push(event.data);
      };

      recorder.onstop = () => {
        // We have a recorded video blob
        const blob = new Blob(localChunks, { type: mimeType });
        // Add the message with video blob
        setChatMessages((prev) => [
          ...prev,
          { sender: 'me', text: '', video: blob },
        ]);
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
        scrollToBottom();
      };

      recorder.start();
      setIsRecordingVideo(true);
    } catch (error) {
      console.error('Error accessing camera/microphone: ', error);
      // TODO: show error to user
    }
  };

  const stopRecordingVideo = () => {
    if (videoRecorder && videoRecorder.state !== 'inactive') {
      videoRecorder.stop();
      setIsRecordingVideo(false);
    }
  };

  /**
   * RENDER
   */

  if (!contact) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Contact not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 7 }}>
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
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon />
        </IconButton>
        <Box
          onClick={() => navigate(`/user-profile/${contact.isu}`)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            cursor: 'pointer',
            ml: 1,
          }}
        >
          <Avatar src={contact.logo} sx={{ width: 40, height: 40, mx: 1 }} />
          <Typography variant="h6">{contact.username}</Typography>
        </Box>
      </Paper>

      {/* Messages List */}
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

      {/* Message Input */}
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
          placeholder="Type a message!"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {inputValue.trim() ? (
                  <IconButton color="primary" onClick={handleSendText}>
                    <SendIcon />
                  </IconButton>
                ) : (
                  <>
                    {/* AUDIO BUTTON */}
                    <IconButton
                      color={isRecording ? 'error' : 'primary'}
                      onMouseDown={handleMicMouseDown}
                      onMouseUp={handleMicMouseUp}
                      onMouseLeave={handleMicMouseLeave}
                      onTouchStart={handleMicTouchStart}
                      onTouchEnd={handleMicTouchEnd}
                    >
                      <MicIcon />
                    </IconButton>

                    {/* VIDEO BUTTON */}
                    <IconButton
                      color={isRecordingVideo ? 'error' : 'primary'}
                      onClick={() =>
                        isRecordingVideo ? stopRecordingVideo() : startRecordingVideo()
                      }
                    >
                      {isRecordingVideo ? <StopIcon /> : <VideocamIcon />}
                    </IconButton>
                  </>
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default Messages;
