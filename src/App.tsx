import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material';
import theme from './components/theme';
import { CssBaseline, Box } from '@mui/material';
import Nav from './components/basic/Nav';
import ChatPage from './components/pages/ChatPage';
import MatchesPage from './components/pages/MatchesPage';
import FeedPage from './components/pages/FeedPage';
import LoginPage from './components/pages/LoginPage';
import TestsPage from './components/pages/TestsPage';
import ProfilePage from './components/pages/ProfilePage';
import EditProfilePage from './components/pages/EditProfilePage';
import Messages from './components/Messages';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ErrorBoundary, Provider } from '@rollbar/react';
import { rollbarConfig } from './contexts/RollbarConfig';
import { FallbackUI } from './components/FallbackUI';
import RegisterPage from './components/pages/RegisterPage';
import Quiz from './components/pages/Quiz';

const contacts = [
  {
    id: '1',
    name: 'Alice',
    pfp: 'https://randomuser.me/api/portraits/women/1.jpg',
    lastMessage: 'Hey, how are you?',
    stories: [{
      id: '1',
      image: 'https://source.unsplash.com/random/800x600',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }],
  },
  {
    id: '2',
    name: 'Bob',
    pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: 'See you soon!',
    stories: [],
  },
  {
    id: '3',
    name: 'Charlie',
    pfp: 'https://randomuser.me/api/portraits/men/2.jpg',
    lastMessage: 'Let’s catch up tomorrow.',
    stories: [{
      id: '1',
      image: 'https://source.unsplash.com/random/800x600',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }],
  },
  {
    id: '4',
    name: 'Diana',
    pfp: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastMessage: 'Happy Birthday!',
    stories: [{
      id: '1',
      image: 'https://source.unsplash.com/random/800x600',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }],
  },
];

const people = [
  {
    id: 1,
    name: 'Jane Smith1',
    description: 'Product Designer',
    imageUrl: 'https://steamuserimages-a.akamaihd.net/ugc/1844789643806854188/FB581EAD503907F56A009F85371F6FB09A467FEC/?imw=512&imh=497&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
  },
  {
    id: 2,
    name: 'Jane Smith2',
    description: 'Product Designer',
    imageUrl: 'https://i.pinimg.com/736x/56/21/7b/56217b1ef6a69a2583ff13655d48bc53.jpg',
  },
  {
    id: 3,
    name: 'Jane Smith3',
    description: 'Product Designer',
    imageUrl: 'https://avatars.yandex.net/get-music-content/5878680/7bee58da.a.25445174-1/m1000x1000?webp=false',
  },
];

const mockGetQuestions = (id: number) => {
  console.log(id);
  if (id === 1) {
    return [
      {
        id: 1,
        text: 'Question 1?',
      },
    ]
  } else {
    return [
      {
        id: 1,
        text: 'Question 1?',
      },
      {
        id: 2,
        text: 'Question 2?',
      },
    ];
  }
}

function App() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary level={"error"} fallbackUI={FallbackUI}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContent />
        </ThemeProvider>
      </ErrorBoundary>
    </Provider>
  );
}

function AppContent() {
  const location = useLocation();

  const shouldHideNav = /^\/.+\/[^/]+$/.test(location.pathname) || /register/.test(location.pathname);

  const [currentIndex, setCurrentIndex] = useState(0);
  const getNext = () => {
    setCurrentIndex((prev) => (prev + 1) % people.length);
    return people[currentIndex];
  }

  return (
    <>
      <Box sx={{ pb: 7 }}>
        <Routes>
          <Route path="/chats" element={<ChatPage contacts={contacts} />} />
          <Route path="/chat/:id" element={<Messages contacts={contacts} />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/feed" element={<FeedPage getNextPerson={getNext} onLike={console.log} onDislike={console.log} onSuperLike={console.log} />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/tests/:id" element={<Quiz getQuestions={mockGetQuestions} onExit={console.log} onFinish={console.log} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
      {!shouldHideNav && <Nav />}
    </>
  );
}

export default App;
