// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   Avatar,
//   IconButton,
//   TextField,
//   InputAdornment,
//   List,
//   Paper,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import MicIcon from '@mui/icons-material/Mic';
// import VideocamIcon from '@mui/icons-material/Videocam';
// import StopIcon from '@mui/icons-material/Stop';
// import { useParams, useNavigate } from 'react-router-dom';
// import UserMessage from './UserMessage';
// import PageWrapper from '../PageWrapper';
// import { MessageType, RawMessage } from '../types';
// import { Profile } from '../api/profile'

// interface MessagesProps {
//   people: Profile[];
//   messages: RawMessage[];
// }

// const Messages: React.FC<MessagesProps> = ({ people, messages }) => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const contact = people.find((person) => person.isu === Number(id));

//   const [chatMessages, setChatMessages] = useState<MessageType[]>([]);
//   const [inputValue, setInputValue] = useState('');

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   // Audio recorder state
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
//   const [isRecording, setIsRecording] = useState(false);

//   // Video recorder state
//   const [videoRecorder, setVideoRecorder] = useState<MediaRecorder | null>(null);
//   const [isRecordingVideo, setIsRecordingVideo] = useState(false);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [VideoStream, setVideoStream] = useState<MediaStream | null>(null);  // TOOD: UI live VideoStream

//   useEffect(() => {
//     if (contact) {
//       const initialMessages: MessageType[] = messages
//         .filter(
//           (message) =>
//             message.sender_id === contact.isu || message.receiver_id === contact.isu
//         )
//         .map((message) => ({
//           sender: message.sender_id === contact.isu ? 'them' : 'me' as const,
//           text: message.text,
//         }));
//       setChatMessages(initialMessages);
//     }
//   }, [contact, messages]);

//   const handleSendText = () => {
//     if (inputValue.trim() !== '') {
//       setChatMessages((prevMessages) => [
//         ...prevMessages,
//         { sender: 'me', text: inputValue },
//       ]);
//       setInputValue('');
//       scrollToBottom();
//       // TODO: Implement actual message sending logic
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSendText();
//     }
//   };

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, chatMessages]);

//   /**
//    * AUDIO RECORDING LOGIC
//    */
//   const startRecordingAudio = async () => {
//     try {
//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/ogg;codecs=opus';

//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream, { mimeType });
//       setMediaRecorder(recorder);

//       const localChunks: BlobPart[] = [];

//       recorder.ondataavailable = (event) => {
//         localChunks.push(event.data);
//       };

//       recorder.onstop = () => {
//         const blob = new Blob(localChunks, { type: mimeType });
//         setChatMessages((prev) => [
//           ...prev,
//           { sender: 'me', text: '', audio: blob },
//         ]);
//         // Stop all tracks to release microphone
//         stream.getTracks().forEach((track) => track.stop());
//         scrollToBottom();
//       };

//       recorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Error accessing microphone: ', error);
//       // TODO: show error to user
//     }
//   };

//   const stopRecordingAudio = () => {
//     if (mediaRecorder && mediaRecorder.state !== 'inactive') {
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }
//   };

//   // Handlers for mic button (mouse and touch)
//   const handleMicMouseDown = (e: React.MouseEvent) => {
//     e.preventDefault();
//     startRecordingAudio();
//   };

//   const handleMicMouseUp = (e: React.MouseEvent) => {
//     e.preventDefault();
//     stopRecordingAudio();
//   };

//   const handleMicMouseLeave = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (isRecording) {
//       stopRecordingAudio();
//     }
//   };

//   const handleMicTouchStart = (e: React.TouchEvent) => {
//     e.preventDefault();
//     startRecordingAudio();
//   };

//   const handleMicTouchEnd = (e: React.TouchEvent) => {
//     e.preventDefault();
//     stopRecordingAudio();
//   };

//   /**
//    * VIDEO RECORDING LOGIC
//    */
//   const startRecordingVideo = async () => {
//     try {
//       // Decide on a common video MIME type
//       let mimeType = 'video/webm;codecs=vp8';
//       if (!MediaRecorder.isTypeSupported(mimeType)) {
//         // Fallback if needed
//         mimeType = 'video/mp4';
//       }

//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setVideoStream(stream);

//       const recorder = new MediaRecorder(stream, { mimeType });
//       setVideoRecorder(recorder);

//       const localChunks: BlobPart[] = [];

//       recorder.ondataavailable = (event) => {
//         localChunks.push(event.data);
//       };

//       recorder.onstop = () => {
//         // We have a recorded video blob
//         const blob = new Blob(localChunks, { type: mimeType });
//         // Add the message with video blob
//         setChatMessages((prev) => [
//           ...prev,
//           { sender: 'me', text: '', video: blob },
//         ]);
//         // Stop all tracks
//         stream.getTracks().forEach((track) => track.stop());
//         setVideoStream(null);
//         scrollToBottom();
//       };

//       recorder.start();
//       setIsRecordingVideo(true);
//     } catch (error) {
//       console.error('Error accessing camera/microphone: ', error);
//       // TODO: show error to user
//     }
//   };

//   const stopRecordingVideo = () => {
//     if (videoRecorder && videoRecorder.state !== 'inactive') {
//       videoRecorder.stop();
//       setIsRecordingVideo(false);
//     }
//   };

//   /**
//    * RENDER
//    */

//   if (!contact) {
//     return (
//       <Box sx={{ p: 2 }}>
//         <Typography variant="h6">Contact not found</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ pb: 7 }}>
//       {/* Header */}
//       <Paper
//         elevation={1}
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           p: 1,
//           position: 'fixed',
//           top: 0,
//           width: '100%',
//           zIndex: 1,
//           backgroundColor: '#fff',
//         }}
//       >
//         <IconButton onClick={() => navigate(-1)}>
//           <ArrowBackIosIcon />
//         </IconButton>
//         <Box
//           onClick={() => navigate(`/user-profile/${contact.isu}`)}
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             flexGrow: 1,
//             cursor: 'pointer',
//             ml: 1,
//           }}
//         >
//           <Avatar src={contact.logo} sx={{ width: 40, height: 40, mx: 1 }} />
//           <Typography variant="h6">{contact.username}</Typography>
//         </Box>
//       </Paper>

//       {/* Messages List */}
//       <PageWrapper direction={1}>
//         <List
//           sx={{
//             mt: 8,
//             mb: 2,
//             px: 2,
//             overflowY: 'auto',
//             maxHeight: 'calc(100vh - 200px)',
//           }}
//         >
//           {chatMessages.map((message, index) => (
//             <UserMessage key={index} message={message} />
//           ))}
//           <div ref={messagesEndRef} />
//         </List>
//       </PageWrapper>

//       {/* Message Input */}
//       <Box
//         sx={{
//           position: 'fixed',
//           bottom: 16,
//           width: '100%',
//           px: 2,
//           bgcolor: '#fff',
//         }}
//       >
//         <TextField
//           fullWidth
//           placeholder="Type a message!"
//           variant="outlined"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyDown={handleKeyPress}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 {inputValue.trim() ? (
//                   <IconButton color="primary" onClick={handleSendText}>
//                     <SendIcon />
//                   </IconButton>
//                 ) : (
//                   <>
//                     {/* AUDIO BUTTON */}
//                     <IconButton
//                       color={isRecording ? 'error' : 'primary'}
//                       onMouseDown={handleMicMouseDown}
//                       onMouseUp={handleMicMouseUp}
//                       onMouseLeave={handleMicMouseLeave}
//                       onTouchStart={handleMicTouchStart}
//                       onTouchEnd={handleMicTouchEnd}
//                     >
//                       <MicIcon />
//                     </IconButton>

//                     {/* VIDEO BUTTON */}
//                     <IconButton
//                       color={isRecordingVideo ? 'error' : 'primary'}
//                       onClick={() =>
//                         isRecordingVideo ? stopRecordingVideo() : startRecordingVideo()
//                       }
//                     >
//                       {isRecordingVideo ? <StopIcon /> : <VideocamIcon />}
//                     </IconButton>
//                   </>
//                 )}
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default Messages;


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
          { sender: 'me', text: '', image: file }
        ]);
      } else if (isVideo) {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'me', text: '', video: file }
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
      setChatMessages((prev) => [...prev, { sender: 'me', text: '', audio: blob, image: new Blob() }]);
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
      setChatMessages((prev) => [...prev, { sender: 'me', text: '', video: blob, image: new Blob() }]);
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
        style={{ display: 'none' }}
        onChange={handleGalleryChange}
      />
      <input
        type="file"
        ref={fileInputRef}
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
        <IconButton onClick={() => navigate(-1)}>
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
                <IconButton onClick={handleOpenPicker}>
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
      <Modal open={isPickerOpen} onClose={handleClosePicker}>
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
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
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
