import React, { useRef, useState, useMemo } from 'react';
import { ListItem, Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { MessageType } from '../types';

interface UserMessageProps {
  message: MessageType;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate URLs for media content
  const imageURL = useMemo(() => {
    if (message.image && message.image instanceof Blob) {
      return URL.createObjectURL(message.image);
    }
    return undefined;
  }, [message.image]);

  const videoURL = useMemo(() => {
    if (message.video && message.video instanceof Blob) {
      return URL.createObjectURL(message.video);
    }
    return undefined;
  }, [message.video]);

  const audioURL = useMemo(() => {
    if (message.audio && message.audio instanceof Blob) {
      return URL.createObjectURL(message.audio);
    }
    return undefined;
  }, [message.audio]);

  // Handle play/pause for audio
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.load();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error('Audio failed to play:', err);
          });
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <ListItem
      sx={{
        display: 'flex',
        justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
        padding: 0,
      }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          bgcolor: message.sender === 'me' ? '#dcf8c6' : '#ffffff',
          color: 'black',
          borderRadius:
            message.sender === 'me' ? '15px 15px 5px 15px' : '15px 15px 15px 5px',
          padding: '8px 12px',
          margin: '4px',
          wordBreak: 'break-word',
          boxShadow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* IMAGE MESSAGE */}
        {imageURL && (
          <Box
            sx={{
              width: '100%',
              maxWidth: 250,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <img
              src={imageURL}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          </Box>
        )}

        {/* VIDEO MESSAGE */}
        {videoURL && (
          <Box
            sx={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#000',
            }}
          >
            <video
              src={videoURL}
              data-testid="video-element" // Добавьте data-testid для тестов
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              controls
            />
          </Box>
        )}


        {/* FILE MESSAGE */}
        {message.file && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: 250,
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              wordBreak: 'break-word',
            }}
          >
            <a
              href={URL.createObjectURL(message.file)}
              download={message.file.name}
              style={{ textDecoration: 'none', color: '#000' }}
            >
              {message.file.name}
            </a>
          </Box>
        )}

        {/* AUDIO MESSAGE */}
        {audioURL && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <IconButton onClick={handlePlayPause} size="small">
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <audio
              ref={audioRef}
              src={audioURL}
              preload="auto"
              onEnded={handleEnded}
            />
            <Box
              sx={{
                ml: 1,
                fontStyle: 'italic',
                color: 'rgba(0,0,0,0.6)',
              }}
            >
              Voice message
            </Box>
          </Box>
        )}

        {/* TEXT MESSAGE */}
        {!imageURL && !videoURL && !audioURL && message.text && (
          <Box
            sx={{
              wordBreak: 'break-word',
              textAlign: 'left',
            }}
          >
            {message.text}
          </Box>
        )}
      </Box>
    </ListItem>
  );
};

export default UserMessage;
