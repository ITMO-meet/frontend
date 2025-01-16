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
import { sendMessage, UserChat } from '../api/chats';
import { userData } from '../stores/UserDataStore';

interface MessagesProps {
  people: Profile[];
  chats: UserChat[];
  messages: RawMessage[];
}

const Messages: React.FC<MessagesProps> = ({ people, chats, messages }) => {
  /**
   * In a real app, you'd probably get the current user's ISU
   * from a global store or context. For now, let's just hard-code:
   */
  const currentUserIsu = userData.getIsu();

  const [chatMessages, setChatMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Identify the contact from the URL param
  const contact = people.find((person) => person.isu === Number(id));

  // Identify the chat from the URL param
  const chat = chats.find((chat) => chat.isu_2 === Number(id));

  // This is how we'll get the chat_id from the messages array
  const chatId = React.useMemo(() => {
    if (!chat) return undefined;
    return chat.chat_id;
  }, [contact, messages, currentUserIsu]);

  /**
   * -------------- State for audio and video recordings --------------
   */
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  /**
   * -------------- File/Media input references --------------
   */
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /**
   * -------------- Populate local state with existing messages --------------
   */
  useEffect(() => {
    if (contact) {
      const initialMessages: MessageType[] = messages
        .filter(
          (message) =>
            message.sender_id === contact.isu || message.receiver_id === contact.isu
        )
        .map((message) => ({
          sender: message.sender_id === contact.isu ? 'them' : 'me',
          text: message.text ?? '',
          image: message.image,
          video: message.video,
          audio: message.audio,
          file: message.file,
        }));
      console.log("initialMessages: ", initialMessages)
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

  /**
   * -------------- Sending a text message --------------
   */
  const handleSendText = async () => {
    console.log('Sending message:', inputValue);
    console.log('Contact:', contact);
    console.log('chatId:', chatId);
    if (inputValue.trim() === '' || !contact || !chatId) return;

    // Optimistically update local state
    setChatMessages((prev) => [...prev, { sender: 'me', text: inputValue }]);
    const tempText = inputValue; // store before resetting
    setInputValue('');
    scrollToBottom();

    // Make the API call
    try {
      const message_id = await sendMessage(
        chatId,               // chat_id
        currentUserIsu,       // sender_id
        contact.isu,          // receiver_id
        tempText              // text
      );
      console.log('Message sent:', tempText);

      messages.push({
        id: message_id,
        sender_id: currentUserIsu,
        receiver_id: contact.isu,
        text: inputValue,
        chat_id: chatId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally revert the local state or show a notification.
    }
  };

  /**
   * -------------- File & Media Picker --------------
   */
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

  /**
   * -------------- Gallery input change (images/videos) --------------
   */
  const handleGalleryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!contact || !chatId) return;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Immediately push a placeholder message locally
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'me',
          text:
            file.type.startsWith('image/')
              ? 'Image sent'
              : file.type.startsWith('video/')
                ? 'Video sent'
                : 'Media sent',
          image: file.type.startsWith('image/') ? file : undefined,
          video: file.type.startsWith('video/') ? file : undefined,
        },
      ]);
      scrollToBottom();

      let media_type;
      if (file.type.startsWith('image/')) {
        media_type = "image";
      } else if (file.type.startsWith('video/')) {
        media_type = "video";
      } else {
        media_type = "file";
      }

      // Send to the backend
      try {
        const message_id = await sendMessage(
          chatId,
          currentUserIsu,
          contact.isu,
          '', // no text
          file, // pass the file as media
          media_type
        );
        console.log('Message sent:', file);

        messages.push({
          id: message_id,
          sender_id: currentUserIsu,
          receiver_id: contact.isu,
          text:
            file.type.startsWith('image/')
              ? 'Image sent'
              : file.type.startsWith('video/')
                ? 'Video sent'
                : 'Media sent',
          image: file.type.startsWith('image/') ? file : undefined,
          video: file.type.startsWith('video/') ? file : undefined,
          chat_id: chatId,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error sending media message:', error);
      }
    }
  };

  /**
   * -------------- File input change (generic file) --------------
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!contact || !chatId) return;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Update local state
      setChatMessages((prev) => [
        ...prev,
        { sender: 'me', text: file.name, file },
      ]);
      scrollToBottom();

      // Send to the backend
      try {
        const message_id = await sendMessage(
          chatId,
          currentUserIsu,
          contact.isu,
          '', // no text
          file,
          'file'
        );

        messages.push({
          id: message_id,
          sender_id: currentUserIsu,
          receiver_id: contact.isu,
          text: 'File sent',
          file: file,
          chat_id: chatId,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error sending media message:', error);
      }
    }
  };

  /**
   * -------------- Audio Recording --------------
   */
  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });

        // Immediately update chat UI
        setChatMessages((prev) => [
          ...prev,
          { sender: 'me', text: 'Voice message', audio: blob },
        ]);
        // Make the backend call if we have a contact and chatId
        if (contact && chatId) {
          try {
            const file = new File([blob], 'audio.webm', { type: 'audio/webm' });
            const message_id = await sendMessage(
              chatId,
              currentUserIsu,
              contact.isu,
              '', // no text
              file,
              'audio'
            );
            console.log('Audio sent:', file);

            messages.push({
              id: message_id,
              sender_id: currentUserIsu,
              receiver_id: contact.isu,
              text: 'File sent',
              audio: file,
              chat_id: chatId,
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            console.error('Error sending audio:', error);
          }
        }
        // Stop the tracks to release the mic
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to record audio:', err);
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const toggleAudioRecording = async () => {
    if (isRecording) {
      stopRecordingAudio();
    } else {
      await startRecordingAudio();
    }
  };

  /**
   * -------------- Video Recording --------------
   */
  const startRecordingVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });

        // Immediately update chat UI
        setChatMessages((prev) => [
          ...prev,
          { sender: 'me', text: 'Video sent', video: blob },
        ]);
        // Send to backend
        if (contact && chatId) {
          try {
            const file = new File([blob], 'video.webm', { type: 'video/webm' });
            const message_id = await sendMessage(
              chatId,
              currentUserIsu,
              contact.isu,
              '', // no text
              file,
              'video'
            );

            messages.push({
              id: message_id,
              sender_id: currentUserIsu,
              receiver_id: contact.isu,
              text: 'File sent',
              video: file,
              chat_id: chatId,
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            console.error('Error sending video:', error);
          }
        }
        // Stop the tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      setVideoStream(stream);
      setIsRecordingVideo(true);
      recorder.start();
    } catch (error) {
      console.error('Failed to record video:', error);
    }
  };

  const stopRecordingVideo = () => {
    if (isRecordingVideo && videoStream) {
      // This triggers recorder.onstop
      videoStream.getTracks().forEach((track) => track.stop());
      setIsRecordingVideo(false);
    }
  };

  /**
   * -------------- Render --------------
   */
  return (
    <Box sx={{ pb: 7 }}>
      {/* Hidden Inputs */}
      <input
        type="file"
        accept="image/*,video/*"
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
        onChange={handleFileChange}
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
        <IconButton onClick={() => navigate(-1)} data-testid="back-button" sx={{
      '&:active': {
        backgroundColor: '#6a8afc', // Цвет при нажатии
      },
      borderRadius: '50%', // Круглая форма
    }}>
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

      {/* Input Area */}
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
          placeholder="Введите сообщение"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          slotProps={{
            input: {
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
                  <IconButton
                    onClick={toggleAudioRecording}
                    color={isRecording ? 'error' : 'default'}
                    data-testid="mic-button"
                  >
                    {isRecording ? <StopIcon /> : <MicIcon />}
                  </IconButton>
                  <IconButton
                    onClick={isRecordingVideo ? stopRecordingVideo : startRecordingVideo}
                    color={isRecordingVideo ? 'error' : 'default'}
                    data-testid="video-button"
                  >
                    {isRecordingVideo ? <StopIcon /> : <VideocamIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        {/* Optional small text indicators */}
        {isRecording && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
            Запись аудио...
          </Typography>
        )}
        {isRecordingVideo && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
            Запись видео...
          </Typography>
        )}
      </Box>

      {/* Picker Modal */}
      <Modal
        open={isPickerOpen}
        onClose={handleClosePicker}
        aria-labelledby="picker-modal-title"
        role="dialog"
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
            id="picker-modal-title"
            variant="h6"
            sx={{ mb: 3, fontWeight: 'bold' }}
          />
            <Typography
              id="picker-modal-title" // Match the aria-labelledby
              variant="h6"
              sx={{ mb: 3, fontWeight: 'bold' }}
            >
              Выбрать опцию
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
                  Галлерея
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
                  Файл
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Modal>


    </Box>
  );
};

export default Messages;
