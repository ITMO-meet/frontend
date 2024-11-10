import React from 'react';
import { ThemeProvider } from '@mui/material';
import theme from './components/theme';
import { CssBaseline, Box } from '@mui/material';
import Nav from './components/basic/Nav';
import ChatPage from './ChatPage';
import MatchesPage from './MatchesPage';
import SearchPage from './SearchPage';
import TestsPage from './TestsPage';
import ProfilePage from './ProfilePage';
import Messages from './Messages';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();

  const shouldHideNav = /^\/.+\/[^/]+$/.test(location.pathname);

  return (
    <>
      <Box sx={{ pb: 7 }}>
        <Routes>
          <Route path="/chats" element={<ChatPage contacts={contacts} />} />
          <Route path="/chat/:id" element={<Messages contacts={contacts} />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Box>
      {!shouldHideNav && <Nav />}
    </>
  );
}

export default App;
