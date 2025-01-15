import React, { useEffect } from 'react';
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
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ErrorBoundary, Provider } from '@rollbar/react';
import { rollbarConfig } from './contexts/RollbarConfig';
import { FallbackUI } from './components/FallbackUI';
import RegisterPage from './components/pages/RegisterPage';
import Quiz from './components/pages/Quiz';
import { PremiumProvider } from './contexts/PremiumContext';
import PremiumPage from './components/pages/PremiumPage';
import AddStoryPage from './components/pages/AddStoryPage';
import SettingsPage from './components/pages/SettingsPage';
import { initGA, logPageView } from './analytics';
import UserProfilePage from './components/pages/UserProfilePage';
import CalendarPage from './components/pages/CalendarPage';

import { ErrorProvider } from './contexts/ErrorContext';

import { AnimatePresence } from 'framer-motion';
import { Profile } from './api/profile';
import { getUserContacts, getUserMessages, UserChat } from './api/chats';
import { userData } from './stores/UserDataStore';
import { RawMessage } from './types';


const stories = [
  {
    id: '6739c9f339fddecc6b8a44d8',
    isu: 789852,
    url: 'https://www.avsimrus.com/file_images/110/img25865_1.jpg',
    expiration_date: 1731926899,
  },
  {
    id: '6739c9f339fddecc6b8a44d9',
    isu: 123456,
    url: 'https://www.avsim.su/w/images/0/09/003_006.jpg',
    expiration_date: 1731926899,
  },
];

const shouldHideNav = (pathname: string): boolean => {
  const hiddenRoutes = ['/login', '/register', '/edit-profile', '/settings'];
  const hiddenRoutesRegex = /^\/.+\/[^/]+$/;

  if (hiddenRoutes.includes(pathname)) {
    return true;
  }

  if (hiddenRoutesRegex.test(pathname)) {
    return true;
  }

  return false;
};

function App() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary level={"error"} fallbackUI={FallbackUI}>
        <ErrorProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <PremiumProvider>
              <AppContent />
            </PremiumProvider>
          </ThemeProvider>
        </ErrorProvider>
      </ErrorBoundary>
    </Provider>
  );
}

function AppContent() {
  const [contacts, setContacts] = React.useState<Profile[] | null>(null)
  const [chats, setChats] = React.useState<UserChat[] | null>(null);
  const [messages, setMessages] = React.useState<RawMessage[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const hideNav = shouldHideNav(location.pathname);

  // Initialize GA once
  useEffect(() => {
    initGA();
  }, []);

  // Log page views on route change
  useEffect(() => {
    logPageView(location.pathname);
  }, [location.pathname]);

  // Fetch data asynchronously
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const user_id = userData.getIsu();
        const user_id = 386872;
        const fetchedContacts = await getUserContacts(user_id, true) as Profile[];
        const fetchedChats = await getUserContacts(user_id, false) as UserChat[];
        const fetchedMessages = await getUserMessages(fetchedChats);

        setContacts(fetchedContacts);
        setChats(fetchedChats);
        setMessages(fetchedMessages);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Show a loading screen or skeleton UI while data is being fetched
  if (contacts === null || chats === null || messages === null) {
    return <div>Loading...</div>;
  }

  // Once data is loaded, render the real UI
  return (
    <>
      <Box sx={{ pb: 7, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/chats" element={<ChatPage people={contacts} stories={stories} messages={messages} />} />
            <Route path="/add-story" element={<AddStoryPage />} />
            <Route path="/chat/:id" element={<Messages people={contacts} messages={messages} />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/tests/:id" element={<Quiz onExit={() => navigate("/tests")} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/user-profile/:id" element={<UserProfilePage />} />
            <Route path="/schedule" element={<CalendarPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            {/* <Route path="/register" element={<RegisterPage />} /> */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
          </Routes>
        </AnimatePresence>
      </Box>
      {!hideNav && <Nav />}
    </>
  );
}

export default App;
