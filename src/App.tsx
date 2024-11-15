import React, {useEffect, useState} from 'react';
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
import { Routes, Route, useLocation } from 'react-router-dom';
import {Contact, Person} from "./types";
import {
    fetchContacts,
    fetchPeople,
    likePerson,
    dislikePerson,
    superlikePerson,
} from "./api/apiClient";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();

  const shouldHideNav = /^\/.+\/[^/]+$/.test(location.pathname);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [people, setPeople] = useState<Person[]>([]);


  const currentUserId = 1;

    const handleLike = async (person: Person) => {
        try {
            await likePerson(person.id, currentUserId);
            console.log(`Liked person ${person.id}`);
        } catch (error) {
            console.error('Error liking person:', error);
        }
    };


    const handleDislike = async (person: Person) => {
        try {
            await dislikePerson(person.id, currentUserId);
            console.log(`Disliked person ${person.id}`);
        } catch (error) {
            console.error('Error disliking person:', error);
        }
    };

    const handleSuperLike = async (person: Person) => {
        try {
            await superlikePerson(person.id, currentUserId);
            console.log(`Superliked person ${person.id}`);
        } catch (error) {
            console.error('Error superliking person:', error);
        }
    };


    useEffect(() => {
        const loadData = async () => {
            try {
                console.log('Fetching contacts');
                const fetchedContacts = await fetchContacts();
                console.log('Fetched contacts:', fetchedContacts);
                setContacts(fetchedContacts);

                console.log('Fetching people');
                const fetchedPeople = await fetchPeople();
                console.log('Fetched people:', fetchedPeople);
                setPeople(fetchedPeople);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        loadData();
    }, []);



    const [currentIndex, setCurrentIndex] = useState(0);

    const getNext = () => {
        if (people.length === 0) {
            return null; // Return null if no people are available
        }
        const person = people[currentIndex];
        setCurrentIndex((prev) => (prev + 1) % people.length);
        return person;
    };

  return (
    <>
      <Box sx={{ pb: 7 }}>
        <Routes>
          <Route path="/chats" element={<ChatPage contacts={contacts} />} />
          <Route path="/chat/:id" element={<Messages contacts={contacts} />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/feed" element={<FeedPage getNextPerson={getNext} onLike={handleLike} onDislike={handleDislike} onSuperLike={handleSuperLike} />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Box>
      {!shouldHideNav && <Nav />}
    </>
  );
}

export default App;
