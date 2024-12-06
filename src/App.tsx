import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import theme from './components/theme';
import { CssBaseline, Box, Typography } from '@mui/material';
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
import StraightenIcon from '@mui/icons-material/Straighten';
import ChurchIcon from '@mui/icons-material/Church';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BookIcon from '@mui/icons-material/Book';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { PremiumProvider } from './contexts/PremiumContext';
import PremiumPage from './components/pages/PremiumPage';
import AddStoryPage from './components/pages/AddStoryPage';
import SettingsPage from './components/pages/SettingsPage';
import { initGA, logPageView } from './analytics';
import UserProfilePage from './components/pages/UserProfilePage';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupIcon from '@mui/icons-material/Group';

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
    photos: [
      'https://randomwordgenerator.com/img/picture-generator/54e7d7404853a914f1dc8460962e33791c3ad6e04e507440752972d29e4bc3_640.jpg',
      'https://randomwordgenerator.com/img/picture-generator/54e2d34b4a52aa14f1dc8460962e33791c3ad6e04e507749742c78d59e45cc_640.jpg',
      'https://randomwordgenerator.com/img/picture-generator/57e9dc434b5ba414f1dc8460962e33791c3ad6e04e50744172297bd5934cc4_640.jpg',
    ],
    mainFeatures: [
      { text: '170 cm', icon: <StraightenIcon /> },
      { text: 'Atheism', icon: <ChurchIcon /> },
      { text: 'Aries', icon: <Typography sx={{ fontSize: 20 }}>♈️</Typography> },
      { text: 'No but would like', icon: <ChildCareIcon /> },
      { text: 'Neutral', icon: <LocalBarIcon /> },
      { text: 'Neutral', icon: <SmokingRoomsIcon /> },
    ],
    interests: [
      { text: 'Music', icon: <MusicNoteIcon /> },
      { text: 'GYM', icon: <FitnessCenterIcon /> },
      { text: 'Reading', icon: <BookIcon /> },
      { text: 'Cooking', icon: <RestaurantIcon /> },
      { text: 'Raves', icon: <CelebrationIcon /> },
    ],
    itmo: [
      { text: "1", icon: <SchoolIcon /> }, // course
      { text: "ПИиКТ", icon: <HomeIcon />}, // faculty
      { text: "Pxxxxx", icon: <GroupIcon />}, // group
      { text: "123456", icon: <BadgeIcon /> }, // itmo id
    ],
  },
  {
    id: 2,
    name: 'Jane Smith2',
    description: 'Product Designer',
    imageUrl: 'https://i.pinimg.com/736x/56/21/7b/56217b1ef6a69a2583ff13655d48bc53.jpg',
    photos: [
      'https://randomwordgenerator.com/img/picture-generator/53e9d7444b50b10ff3d8992cc12c30771037dbf852547849752678d5964e_640.jpg',
      'https://randomwordgenerator.com/img/picture-generator/52e9d2474854a514f1dc8460962e33791c3ad6e04e50744172297cdd944fc2_640.jpg',
    ],
    mainFeatures: [
      { text: '165 cm', icon: <StraightenIcon /> },
      { text: 'Catholicism', icon: <ChurchIcon /> },
      { text: 'Libra', icon: <Typography sx={{ fontSize: 20 }}>♎</Typography> },
      { text: 'Already have', icon: <ChildCareIcon /> },
      { text: 'Positive', icon: <LocalBarIcon /> },
      { text: 'Negative', icon: <SmokingRoomsIcon /> },
    ],
    interests: [
      { text: 'Traveling', icon: <MusicNoteIcon /> },
      { text: 'Painting', icon: <FitnessCenterIcon /> },
    ],
  },
  {
    id: 3,
    name: 'Jane Smith3',
    description: 'Product Designer',
    imageUrl: 'https://avatars.yandex.net/get-music-content/5878680/7bee58da.a.25445174-1/m1000x1000?webp=false',
    photos: [
      'https://randomwordgenerator.com/img/picture-generator/53e9d7444b50b10ff3d8992cc12c30771037dbf852547849752678d5964e_640.jpg',
      'https://randomwordgenerator.com/img/picture-generator/52e9d2474854a514f1dc8460962e33791c3ad6e04e50744172297cdd944fc2_640.jpg',
    ],
    mainFeatures: [
      { text: '195 cm', icon: <StraightenIcon /> },
      { text: 'Catholicism', icon: <ChurchIcon /> },
      { text: 'Libra', icon: <Typography sx={{ fontSize: 20 }}>♎</Typography> },
      { text: 'Already have', icon: <ChildCareIcon /> },
      { text: 'Positive', icon: <LocalBarIcon /> },
      { text: 'Negative', icon: <SmokingRoomsIcon /> },
    ],
    interests: [
      { text: 'Traveling', icon: <MusicNoteIcon /> },
      { text: 'Painting', icon: <FitnessCenterIcon /> },
    ],
  },
];

const mockGetQuestions = (id: number) => {
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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <PremiumProvider>
            <AppContent />
          </PremiumProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </Provider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const hideNav = shouldHideNav(location.pathname);

  useEffect(() => {
    initGA();
    console.log("GA init");
  }, []);

  useEffect(() => {
    logPageView(location.pathname);
  }, [location.pathname]);

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
          <Route path="/add-story" element={<AddStoryPage />} />
          <Route path="/chat/:id" element={<Messages contacts={contacts} />} />
          <Route path="/matches" element={<MatchesPage people={people} />} />
          <Route path="/feed" element={<FeedPage getNextPerson={getNext} onLike={console.log} onDislike={console.log} onSuperLike={console.log} />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/tests/:id" element={<Quiz getQuestions={mockGetQuestions} onExit={() => navigate("/chats")} onFinish={console.log} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/user-profile/:id" element={<UserProfilePage people={people} />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
      {!hideNav && <Nav />}
    </>
  );
}

export default App;
