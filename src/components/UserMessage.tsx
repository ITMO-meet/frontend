import React, { useRef, useState, useMemo } from 'react';
import { ListItem, Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

interface UserMessageProps {
  message: {
    sender: 'me' | 'them';
    text: string;
    audio?: Blob;
  };
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioURL = useMemo(() => {
    if (message.audio) {
      return URL.createObjectURL(message.audio);
    }
    return undefined;
  }, [message.audio]);

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
          alignItems: 'center',
        }}
      >
        {message.audio ? (
          <>
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
          </>
        ) : (
          message.text
        )}
      </Box>
    </ListItem>
  );
};

export default UserMessage;
